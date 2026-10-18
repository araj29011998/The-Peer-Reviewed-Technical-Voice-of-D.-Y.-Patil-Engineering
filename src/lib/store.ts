import { useState, useEffect } from 'react';
import { 
  UserProfile, 
  Category, 
  Article, 
  Comment, 
  ArticleLike, 
  Follow, 
  VerificationRequest, 
  ModerationLog, 
  MonthlyLeaderboardRank,
  ArticleStatus
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_CATEGORIES, 
  INITIAL_ARTICLES, 
  INITIAL_LIKES, 
  INITIAL_COMMENTS, 
  INITIAL_FOLLOWS, 
  INITIAL_VERIFICATION_REQUESTS, 
  INITIAL_MODERATION_LOGS 
} from './mockData';
import { isSupabaseConfigured, ALLOWED_EMAIL_DOMAINS } from './supabase';

const STORAGE_KEY_PREFIX = 'dyp_techverse_v1_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Failed to load ${key} from storage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save ${key} to storage:`, err);
  }
}

// Global in-memory cache to ensure reactivity across components
let usersStore: UserProfile[] = loadFromStorage('users', INITIAL_USERS);
let categoriesStore: Category[] = loadFromStorage('categories', INITIAL_CATEGORIES);
let articlesStore: Article[] = loadFromStorage('articles', INITIAL_ARTICLES);
let likesStore: ArticleLike[] = loadFromStorage('likes', INITIAL_LIKES);
let commentsStore: Comment[] = loadFromStorage('comments', INITIAL_COMMENTS);
let followsStore: Follow[] = loadFromStorage('follows', INITIAL_FOLLOWS);
let verificationsStore: VerificationRequest[] = loadFromStorage('verifications', INITIAL_VERIFICATION_REQUESTS);
let moderationLogsStore: ModerationLog[] = loadFromStorage('moderation_logs', INITIAL_MODERATION_LOGS);

// Default current user: Rohit Sharma (verified student author)
let currentUserId: string | null = loadFromStorage('current_user_id', 'usr-student-1');

const listeners = new Set<() => void>();

function notifyAll(): void {
  listeners.forEach((listener) => listener());
}

export function useTechVerseStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const currentUser = usersStore.find((u) => u.id === currentUserId) || null;

  // Helper to enrich articles with author, category, like count, etc.
  const enrichedArticles = articlesStore.map((art) => {
    const author = usersStore.find((u) => u.id === art.authorId);
    const category = categoriesStore.find((c) => c.id === art.categoryId);
    const likes = likesStore.filter((l) => l.articleId === art.id);
    const comments = commentsStore.filter((c) => c.articleId === art.id && !c.isHidden);
    const isLiked = currentUser ? likes.some((l) => l.userId === currentUser.id) : false;

    return {
      ...art,
      author,
      category,
      likesCount: likes.length,
      commentsCount: comments.length,
      isLikedByCurrentUser: isLiked,
    };
  });

  // Switch authenticated active user
  const switchUser = (userId: string | null) => {
    currentUserId = userId;
    saveToStorage('current_user_id', currentUserId);
    notifyAll();
  };

  // Sign in / Sign up with Institutional or Personal Email
  const authenticateWithEmail = (email: string, fullName: string, studentId?: string, department?: string) => {
    const lowerEmail = email.trim().toLowerCase();
    const existing = usersStore.find((u) => u.email.toLowerCase() === lowerEmail);

    if (existing) {
      currentUserId = existing.id;
      saveToStorage('current_user_id', currentUserId);
      notifyAll();
      return { success: true, user: existing, message: 'Welcome back!' };
    }

    const domain = lowerEmail.split('@')[1] || '';
    const isInstitutional = ALLOWED_EMAIL_DOMAINS.includes(domain);

    const newUser: UserProfile = {
      id: 'usr-' + Date.now().toString(36),
      email: lowerEmail,
      fullName: fullName.trim(),
      role: 'student',
      verificationStatus: isInstitutional ? 'verified' : 'pending',
      studentId: studentId?.trim() || 'DYP-' + Math.floor(1000 + Math.random() * 9000),
      department: department?.trim() || 'Computer Engineering',
      batchYear: 2027,
      technicalInterests: [],
      isInstitutionalEmail: isInstitutional,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usersStore = [...usersStore, newUser];
    saveToStorage('users', usersStore);

    if (!isInstitutional) {
      // Auto-create a pending verification request for admin review
      const newReq: VerificationRequest = {
        id: 'ver-' + Date.now().toString(36),
        userId: newUser.id,
        personalEmail: lowerEmail,
        studentIdNumber: newUser.studentId || '',
        department: newUser.department || '',
        batchYear: 2027,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      verificationsStore = [newReq, ...verificationsStore];
      saveToStorage('verifications', verificationsStore);
    }

    currentUserId = newUser.id;
    saveToStorage('current_user_id', currentUserId);
    notifyAll();

    return { 
      success: true, 
      user: newUser, 
      message: isInstitutional 
        ? 'Institutional email verified! You can now publish articles.' 
        : 'Registered with personal email. Please submit your college ID verification request to publish.' 
    };
  };

  // Create or save draft article
  const saveArticle = (articleData: {
    title: string;
    summary: string;
    content: string;
    categoryId: string;
    tags: string[];
    coverImageUrl?: string;
    submitForReview: boolean;
    existingArticleId?: string;
  }) => {
    if (!currentUser) {
      throw new Error('Authentication required to create or save an article.');
    }

    // Unverified students cannot submit for review
    if (articleData.submitForReview && currentUser.verificationStatus !== 'verified') {
      throw new Error('Only verified college students and faculty can submit articles for peer review.');
    }

    const targetStatus: ArticleStatus = articleData.submitForReview ? 'pending_review' : 'draft';
    const words = articleData.content.trim().split(/\s+/).length;
    const readTime = Math.max(2, Math.ceil(words / 200));

    if (articleData.existingArticleId) {
      const existing = articlesStore.find((a) => a.id === articleData.existingArticleId);
      if (!existing) throw new Error('Article not found.');

      if (existing.authorId !== currentUser.id && currentUser.role !== 'admin') {
        throw new Error('Unauthorized to modify this article.');
      }

      // If updating an article that was already published, creating changes requires a new moderation review
      const isPublished = existing.status === 'published';
      const updatedStatus: ArticleStatus = isPublished 
        ? (articleData.submitForReview ? 'pending_review' : 'changes_requested') 
        : targetStatus;

      articlesStore = articlesStore.map((art) => {
        if (art.id === articleData.existingArticleId) {
          return {
            ...art,
            title: articleData.title,
            slug: articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            summary: articleData.summary,
            content: articleData.content,
            categoryId: articleData.categoryId,
            tags: articleData.tags,
            coverImageUrl: articleData.coverImageUrl || art.coverImageUrl,
            status: updatedStatus,
            readTimeMinutes: readTime,
            updatedAt: new Date().toISOString(),
          };
        }
        return art;
      });

      saveToStorage('articles', articlesStore);
      notifyAll();
      return articleData.existingArticleId;
    }

    // New Article
    const newId = 'art-' + Date.now().toString(36);
    const slug = articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);

    const newArticle: Article = {
      id: newId,
      authorId: currentUser.id,
      title: articleData.title,
      slug,
      summary: articleData.summary,
      content: articleData.content,
      categoryId: articleData.categoryId,
      tags: articleData.tags,
      coverImageUrl: articleData.coverImageUrl || '/src/assets/images/hero_techverse_magazine_1791975433144.jpg',
      status: targetStatus,
      readTimeMinutes: readTime,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    articlesStore = [newArticle, ...articlesStore];
    saveToStorage('articles', articlesStore);
    notifyAll();
    return newId;
  };

  // Admin moderation: Approve & Publish
  const approveAndPublishArticle = (articleId: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only authorized platform administrators can approve publications.');
    }

    const article = articlesStore.find((a) => a.id === articleId);
    if (!article) throw new Error('Article not found.');

    articlesStore = articlesStore.map((art) => {
      if (art.id === articleId) {
        return {
          ...art,
          status: 'published' as ArticleStatus,
          publishedAt: art.publishedAt || new Date().toISOString(),
          rejectionReason: undefined,
          changesFeedback: undefined,
          updatedAt: new Date().toISOString(),
        };
      }
      return art;
    });

    const newLog: ModerationLog = {
      id: 'mod-' + Date.now().toString(36),
      adminId: currentUser.id,
      adminName: currentUser.fullName,
      targetType: 'article',
      targetId: articleId,
      targetTitle: article.title,
      action: 'approve_and_publish',
      reason: 'Meets academic writing standards and college publishing guidelines.',
      createdAt: new Date().toISOString(),
    };

    moderationLogsStore = [newLog, ...moderationLogsStore];
    saveToStorage('articles', articlesStore);
    saveToStorage('moderation_logs', moderationLogsStore);
    notifyAll();
  };

  // Admin moderation: Request Changes (with mandatory reason)
  const requestChanges = (articleId: string, feedback: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only authorized platform administrators can request revisions.');
    }
    if (!feedback.trim()) {
      throw new Error('A detailed explanation is mandatory when requesting article revisions.');
    }

    const article = articlesStore.find((a) => a.id === articleId);
    if (!article) throw new Error('Article not found.');

    articlesStore = articlesStore.map((art) => {
      if (art.id === articleId) {
        return {
          ...art,
          status: 'changes_requested' as ArticleStatus,
          changesFeedback: feedback.trim(),
          updatedAt: new Date().toISOString(),
        };
      }
      return art;
    });

    const newLog: ModerationLog = {
      id: 'mod-' + Date.now().toString(36),
      adminId: currentUser.id,
      adminName: currentUser.fullName,
      targetType: 'article',
      targetId: articleId,
      targetTitle: article.title,
      action: 'request_changes',
      reason: feedback.trim(),
      createdAt: new Date().toISOString(),
    };

    moderationLogsStore = [newLog, ...moderationLogsStore];
    saveToStorage('articles', articlesStore);
    saveToStorage('moderation_logs', moderationLogsStore);
    notifyAll();
  };

  // Admin moderation: Reject Article (with mandatory reason)
  const rejectArticle = (articleId: string, reason: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only authorized platform administrators can reject articles.');
    }
    if (!reason.trim()) {
      throw new Error('A mandatory reason must be provided when rejecting a student submission.');
    }

    const article = articlesStore.find((a) => a.id === articleId);
    if (!article) throw new Error('Article not found.');

    articlesStore = articlesStore.map((art) => {
      if (art.id === articleId) {
        return {
          ...art,
          status: 'rejected' as ArticleStatus,
          rejectionReason: reason.trim(),
          updatedAt: new Date().toISOString(),
        };
      }
      return art;
    });

    const newLog: ModerationLog = {
      id: 'mod-' + Date.now().toString(36),
      adminId: currentUser.id,
      adminName: currentUser.fullName,
      targetType: 'article',
      targetId: articleId,
      targetTitle: article.title,
      action: 'reject',
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
    };

    moderationLogsStore = [newLog, ...moderationLogsStore];
    saveToStorage('articles', articlesStore);
    saveToStorage('moderation_logs', moderationLogsStore);
    notifyAll();
  };

  // Admin moderation: Unpublish Article
  const unpublishArticle = (articleId: string, reason: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only administrators can unpublish content.');
    }
    if (!reason.trim()) {
      throw new Error('An unpublish reason is mandatory.');
    }

    const article = articlesStore.find((a) => a.id === articleId);
    if (!article) throw new Error('Article not found.');

    articlesStore = articlesStore.map((art) => {
      if (art.id === articleId) {
        return {
          ...art,
          status: 'draft' as ArticleStatus,
          rejectionReason: reason.trim(),
          updatedAt: new Date().toISOString(),
        };
      }
      return art;
    });

    const newLog: ModerationLog = {
      id: 'mod-' + Date.now().toString(36),
      adminId: currentUser.id,
      adminName: currentUser.fullName,
      targetType: 'article',
      targetId: articleId,
      targetTitle: article.title,
      action: 'unpublish',
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
    };

    moderationLogsStore = [newLog, ...moderationLogsStore];
    saveToStorage('articles', articlesStore);
    saveToStorage('moderation_logs', moderationLogsStore);
    notifyAll();
  };

  // Like / Unlike Article (One per user, strictly for published articles)
  const toggleLike = (articleId: string) => {
    if (!currentUser) throw new Error('Please sign in to like articles.');
    if (currentUser.verificationStatus !== 'verified') {
      throw new Error('Only verified college students and faculty can interact with articles.');
    }

    const article = articlesStore.find((a) => a.id === articleId);
    if (!article || article.status !== 'published') {
      throw new Error('Likes can only be given to published articles.');
    }

    const existingIndex = likesStore.findIndex(
      (l) => l.articleId === articleId && l.userId === currentUser.id
    );

    if (existingIndex >= 0) {
      likesStore = likesStore.filter((_, idx) => idx !== existingIndex);
    } else {
      const newLike: ArticleLike = {
        id: 'like-' + Date.now().toString(36),
        articleId,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
      };
      likesStore = [...likesStore, newLike];
    }

    saveToStorage('likes', likesStore);
    notifyAll();
  };

  // Add Comment
  const addComment = (articleId: string, content: string) => {
    if (!currentUser) throw new Error('Please sign in to comment.');
    if (currentUser.verificationStatus !== 'verified') {
      throw new Error('Only verified students and faculty can participate in article discussions.');
    }
    if (!content.trim()) throw new Error('Comment cannot be empty.');
    if (content.length > 1000) throw new Error('Comment exceeds 1,000 characters limit.');

    const newComment: Comment = {
      id: 'comm-' + Date.now().toString(36),
      articleId,
      userId: currentUser.id,
      content: content.trim(),
      isHidden: false,
      reportCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    commentsStore = [...commentsStore, newComment];
    saveToStorage('comments', commentsStore);
    notifyAll();
  };

  // Delete Comment (Author or Admin)
  const deleteComment = (commentId: string) => {
    if (!currentUser) throw new Error('Unauthorized.');
    const comment = commentsStore.find((c) => c.id === commentId);
    if (!comment) return;

    if (comment.userId !== currentUser.id && currentUser.role !== 'admin') {
      throw new Error('You can only delete your own comments.');
    }

    commentsStore = commentsStore.filter((c) => c.id !== commentId);
    saveToStorage('comments', commentsStore);
    notifyAll();
  };

  // Report Comment
  const reportComment = (commentId: string) => {
    if (!currentUser) throw new Error('Please sign in to report a comment.');
    commentsStore = commentsStore.map((c) => {
      if (c.id === commentId) {
        return { ...c, reportCount: c.reportCount + 1 };
      }
      return c;
    });
    saveToStorage('comments', commentsStore);
    notifyAll();
  };

  // Hide / Moderate Comment (Admin only)
  const hideComment = (commentId: string, hide: boolean) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only administrators can moderate comments.');
    }

    commentsStore = commentsStore.map((c) => {
      if (c.id === commentId) {
        return { ...c, isHidden: hide };
      }
      return c;
    });

    const newLog: ModerationLog = {
      id: 'mod-' + Date.now().toString(36),
      adminId: currentUser.id,
      adminName: currentUser.fullName,
      targetType: 'comment',
      targetId: commentId,
      action: hide ? 'hide_comment' : 'unhide_comment',
      reason: 'Academic community policy enforcement',
      createdAt: new Date().toISOString(),
    };

    moderationLogsStore = [newLog, ...moderationLogsStore];
    saveToStorage('comments', commentsStore);
    saveToStorage('moderation_logs', moderationLogsStore);
    notifyAll();
  };

  // Follow / Unfollow Author
  const toggleFollow = (authorId: string) => {
    if (!currentUser) throw new Error('Please sign in to follow authors.');
    if (currentUser.id === authorId) {
      throw new Error('Authors cannot follow themselves.');
    }

    const existingIndex = followsStore.findIndex(
      (f) => f.followerId === currentUser.id && f.followingId === authorId
    );

    if (existingIndex >= 0) {
      followsStore = followsStore.filter((_, idx) => idx !== existingIndex);
    } else {
      const newFollow: Follow = {
        id: 'fol-' + Date.now().toString(36),
        followerId: currentUser.id,
        followingId: authorId,
        createdAt: new Date().toISOString(),
      };
      followsStore = [...followsStore, newFollow];
    }

    saveToStorage('follows', followsStore);
    notifyAll();
  };

  // Student verification request (Manual review workflow)
  const requestVerification = (data: {
    studentIdNumber: string;
    collegeIdCardUrl: string;
    department: string;
    batchYear: number;
    institutionalEmail?: string;
  }) => {
    if (!currentUser) throw new Error('Authentication required.');

    const newRequest: VerificationRequest = {
      id: 'ver-' + Date.now().toString(36),
      userId: currentUser.id,
      personalEmail: currentUser.email,
      institutionalEmail: data.institutionalEmail,
      studentIdNumber: data.studentIdNumber.trim(),
      collegeIdCardUrl: data.collegeIdCardUrl,
      department: data.department.trim(),
      batchYear: data.batchYear,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update profile with submitted data
    usersStore = usersStore.map((u) => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          studentId: data.studentIdNumber.trim(),
          department: data.department.trim(),
          batchYear: data.batchYear,
          verificationStatus: 'pending',
        };
      }
      return u;
    });

    verificationsStore = [newRequest, ...verificationsStore];
    saveToStorage('users', usersStore);
    saveToStorage('verifications', verificationsStore);
    notifyAll();
  };

  // Admin: Review verification request
  const reviewVerification = (requestId: string, approve: boolean, notes: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only administrators can approve verification requests.');
    }

    const req = verificationsStore.find((r) => r.id === requestId);
    if (!req) throw new Error('Verification request not found.');

    const newStatus = approve ? 'verified' : 'rejected';

    verificationsStore = verificationsStore.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: newStatus,
          adminNotes: notes.trim(),
          reviewedBy: currentUser.id,
          reviewedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });

    usersStore = usersStore.map((u) => {
      if (u.id === req.userId) {
        return {
          ...u,
          verificationStatus: newStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return u;
    });

    const newLog: ModerationLog = {
      id: 'mod-' + Date.now().toString(36),
      adminId: currentUser.id,
      adminName: currentUser.fullName,
      targetType: 'verification',
      targetId: requestId,
      action: approve ? 'verify_student' : 'reject_verification',
      reason: notes.trim() || (approve ? 'Student ID confirmed with departmental registry' : 'Unverifiable student credentials'),
      createdAt: new Date().toISOString(),
    };

    moderationLogsStore = [newLog, ...moderationLogsStore];
    saveToStorage('users', usersStore);
    saveToStorage('verifications', verificationsStore);
    saveToStorage('moderation_logs', moderationLogsStore);
    notifyAll();
  };

  // Manage Categories (Admin only)
  const createCategory = (name: string, description: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only administrators can add categories.');
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat: Category = {
      id: 'cat-' + Date.now().toString(36),
      name: name.trim(),
      slug,
      description: description.trim(),
      isActive: true,
      displayOrder: categoriesStore.length + 1,
      createdAt: new Date().toISOString(),
    };
    categoriesStore = [...categoriesStore, newCat];
    saveToStorage('categories', categoriesStore);
    notifyAll();
  };

  const toggleCategoryActive = (categoryId: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only administrators can toggle category status.');
    }
    categoriesStore = categoriesStore.map((c) => {
      if (c.id === categoryId) {
        return { ...c, isActive: !c.isActive };
      }
      return c;
    });
    saveToStorage('categories', categoriesStore);
    notifyAll();
  };

  const deleteCategory = (categoryId: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only administrators can delete categories.');
    }
    const hasArticles = articlesStore.some((a) => a.categoryId === categoryId);
    if (hasArticles) {
      throw new Error('Cannot delete category: existing published or draft articles are assigned to it. Deactivate instead to preserve content links.');
    }
    categoriesStore = categoriesStore.filter((c) => c.id !== categoryId);
    saveToStorage('categories', categoriesStore);
    notifyAll();
  };

  // Compute Monthly Leaderboard
  // Rank by number of eligible articles first published during the selected month
  // Tie-breaker:
  // 1. Number of distinct publication days
  // 2. Earliest achievement timestamp of the tied total
  const getMonthlyLeaderboard = (monthYear: string): MonthlyLeaderboardRank[] => {
    // monthYear in format 'YYYY-MM' (e.g. '2026-10')
    const publishedInMonth = articlesStore.filter((a) => {
      if (a.status !== 'published' || !a.publishedAt) return false;
      return a.publishedAt.startsWith(monthYear);
    });

    const authorStatsMap = new Map<string, {
      count: number;
      distinctDays: Set<string>;
      earliestTime: string;
    }>();

    publishedInMonth.forEach((art) => {
      const authorId = art.authorId;
      const pubDate = new Date(art.publishedAt!);
      const dayKey = pubDate.toISOString().split('T')[0];

      if (!authorStatsMap.has(authorId)) {
        authorStatsMap.set(authorId, {
          count: 1,
          distinctDays: new Set([dayKey]),
          earliestTime: art.publishedAt!,
        });
      } else {
        const stats = authorStatsMap.get(authorId)!;
        stats.count += 1;
        stats.distinctDays.add(dayKey);
        if (art.publishedAt! < stats.earliestTime) {
          stats.earliestTime = art.publishedAt!;
        }
      }
    });

    const results: MonthlyLeaderboardRank[] = [];

    authorStatsMap.forEach((stats, authorId) => {
      const author = usersStore.find((u) => u.id === authorId);
      if (author) {
        results.push({
          authorId,
          author,
          publicationMonth: monthYear,
          eligibleArticleCount: stats.count,
          distinctPublicationDays: stats.distinctDays.size,
          earliestPublicationTime: stats.earliestTime,
          rank: 0,
        });
      }
    });

    // Sort by: count DESC -> distinctDays DESC -> earliestTime ASC
    results.sort((a, b) => {
      if (b.eligibleArticleCount !== a.eligibleArticleCount) {
        return b.eligibleArticleCount - a.eligibleArticleCount;
      }
      if (b.distinctPublicationDays !== a.distinctPublicationDays) {
        return b.distinctPublicationDays - a.distinctPublicationDays;
      }
      return a.earliestPublicationTime.localeCompare(b.earliestPublicationTime);
    });

    // Assign rank with tie handling
    results.forEach((item, index) => {
      item.rank = index + 1;
    });

    return results;
  };

  return {
    currentUser,
    users: usersStore,
    categories: categoriesStore,
    articles: enrichedArticles,
    likes: likesStore,
    comments: commentsStore,
    follows: followsStore,
    verificationRequests: verificationsStore,
    moderationLogs: moderationLogsStore,
    isSupabaseLive: isSupabaseConfigured(),
    switchUser,
    authenticateWithEmail,
    saveArticle,
    approveAndPublishArticle,
    requestChanges,
    rejectArticle,
    unpublishArticle,
    toggleLike,
    addComment,
    deleteComment,
    reportComment,
    hideComment,
    toggleFollow,
    requestVerification,
    reviewVerification,
    createCategory,
    toggleCategoryActive,
    deleteCategory,
    getMonthlyLeaderboard,
  };
}
