import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { authRepository } from '../repositories/auth.repository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../config/jwt';
import { env } from '../config/env';
import { AuthResponseDto, UserResponseDto } from '../dto/auth/auth.dto';
import { LoginInput, RegisterInput } from '../validators/auth.validator';
import { ConflictError, UnauthorizedError } from '../errors/AppError';

const toUserResponse = (user: User): UserResponseDto => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

const issueTokens = (user: User): { accessToken: string; refreshToken: string } => {
  const payload = { sub: user.id, email: user.email, role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export const authService = {
  async register(input: RegisterInput): Promise<AuthResponseDto> {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, env.bcryptSaltRounds);
    const user = await authRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });

    return { user: toUserResponse(user), ...issueTokens(user) };
  },

  async login(input: LoginInput): Promise<AuthResponseDto> {
    const user = await authRepository.findByEmail(input.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedError('Invalid email or password');
    }

    return { user: toUserResponse(user), ...issueTokens(user) };
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await authRepository.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User no longer active');
    }

    return issueTokens(user);
  },

  async me(userId: string): Promise<UserResponseDto> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    return toUserResponse(user);
  },
};
