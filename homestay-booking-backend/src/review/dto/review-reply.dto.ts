import { IsString, IsNotEmpty } from 'class-validator';

export class ReviewReplyDto {
  @IsString()
  @IsNotEmpty()
  ownerReply: string;
}