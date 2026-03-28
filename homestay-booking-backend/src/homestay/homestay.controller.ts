import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { HomestayService } from './homestay.service';
import { CreateHomestayDto } from './dto/create-homestay.dto';
import { UpdateHomestayDto } from './dto/update-homestay.dto';
import { UpdateStatusHomestayDto } from './dto/update-status-homestay.dto';

@Controller('homestays')
export class HomestayController {
  constructor(private readonly homestayService: HomestayService) {}

  @Post()
  async createHomestay(@Body() createHomestayDto: CreateHomestayDto) {
    return this.homestayService.createHomestay(createHomestayDto);
  }

  @Get('search')
  async searchHomestays(@Body('keyword') keyword: string) {
    return this.homestayService.searchHomestays(keyword);
  }

  @Get('my-homestays')
  async getMyHomestays(@Request() req: any) {
    return this.homestayService.getHomestaysByOwner(req.user.id);
  }

  @Get()
  async getAllHomestays() {
    const homestays = await this.homestayService.getAllHomestays();
    return { data: homestays, total: homestays.length };
  }

  @Get(':id')
  async getHomestayById(@Param('id') id: string) {
    return this.homestayService.getHomestayById(id);
  }

  @Patch(':id')
  async updateHomestay(
    @Param('id') id: string,
    @Body() updateHomestayDto: UpdateHomestayDto,
  ) {
    return this.homestayService.updateHomestay(id, updateHomestayDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusHomestayDto,
  ) {
    return this.homestayService.updateStatusHomestay(id, updateStatusDto);
  }

  @Delete(':id')
  async deleteHomestay(@Param('id') id: string) {
    return this.homestayService.deleteHomestay(id);
  }
}
