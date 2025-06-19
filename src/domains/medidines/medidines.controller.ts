import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { CreateMedicineDto, UpdateMedicineDto } from './dto/create-supplier.dto';
import { Medicine } from './medidines.schema';
import { MedicineService } from './medidines.service';

@Controller('medicines')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  async create(@Body() createMedicineDto: CreateMedicineDto): Promise<Medicine> {
    return this.medicineService.create(createMedicineDto);
  }
  @Get('search')
  async search(@Query() query: Record<string, string>): Promise<Medicine[]> {
    return this.medicineService.searchMedicines(query);
  }
  @Get()
  async findAll(): Promise<Medicine[]> {
    return this.medicineService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Medicine> {
    return this.medicineService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMedicineDto: UpdateMedicineDto): Promise<Medicine> {
    return this.medicineService.update(id, updateMedicineDto);
  }

  @Delete()
  async deleteManyMedicines(@Body('ids') ids: string[]) {
    return this.medicineService.deleteManyByIds(ids);
  }
}
