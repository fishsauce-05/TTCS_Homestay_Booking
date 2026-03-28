// src/review/review.controller.ts

import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewReplyDto } from './dto/review-reply.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post(':homestayId')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('homestayId') homestayId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Request() req,
  ) {
    return this.reviewService.create(homestayId, req.user.id, createReviewDto);
  }

  @Get('homestay/:homestayId')
  async getReviewsByHomestay(@Param('homestayId') homestayId: string) {
    return this.reviewService.getReviewsByHomestay(homestayId);
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    return this.reviewService.getReviewById(id);
  }

  @Patch(':id/reply')
  @UseGuards(JwtAuthGuard)
  async reply(
    @Param('id') id: string,
    @Body() reviewReplyDto: ReviewReplyDto,
    @Request() req,
  ) {
    return this.reviewService.reply(id, req.user.id, reviewReplyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Request() req) {
    return this.reviewService.deleteReview(id, req.user.id);
  }
}