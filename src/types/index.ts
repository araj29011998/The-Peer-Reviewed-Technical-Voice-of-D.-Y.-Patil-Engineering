/**
 * DY Patil TechVerse - Data Models and Type Definitions
 */

export type UserRole = 'student' | 'faculty' | 'admin';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type ArticleStatus = 
  | 'draft'
  | 'pending_verification'
  | 'pending_review'
  | 'changes_requested'
  | 'approved'
  | 'published'
  | 'rejected';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  studentId?: string;
  department?: string;
  batchYear?: number;
  technicalInterests: string[];
  isInstitutionalEmail: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface Article {
  id: string;
  authorId: string;
  author?: UserProfile;
  title: string;
  slug: string;
  summary: string;
  content: string;
  categoryId: string;
  category?: Category;
  tags: string[];
  coverImageUrl?: string;
  status: ArticleStatus;
  rejectionReason?: string;
  changesFeedback?: string;
  readTimeMinutes: number;
  publishedAt?: string;
  viewsCount: number;
  parentVersionId?: string;
  createdAt: string;
  updatedAt: string;
  likesCount?: number;
  commentsCount?: number;
  isLikedByCurrentUser?: boolean;
}

export interface ArticleLike {
  id: string;
  articleId: string;
  userId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  user?: UserProfile;
  content: string;
  isHidden: boolean;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  user?: UserProfile;
  institutionalEmail?: string;
  personalEmail?: string;
  studentIdNumber: string;
  collegeIdCardUrl?: string;
  department: string;
  batchYear: number;
  status: VerificationStatus;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModerationLog {
  id: string;
  adminId: string;
  adminName: string;
  targetType: 'article' | 'verification' | 'comment' | 'category';
  targetId: string;
  targetTitle?: string;
  action: string;
  reason?: string;
  createdAt: string;
}

export interface MonthlyLeaderboardRank {
  authorId: string;
  author: UserProfile;
  publicationMonth: string; // YYYY-MM
  eligibleArticleCount: number;
  distinctPublicationDays: number;
  earliestPublicationTime: string;
  rank: number;
}
