import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { CreateSupplierDto, UpdateSupplierDto } from "./dto/create-supplier.dto";
import { Supplier } from "./supplier.schema";
import { SupplierService } from "./supplier.service";

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  async findAll(): Promise<Supplier[]> {
    return this.supplierService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Supplier> {
    return this.supplierService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{success:boolean}> {
    return this.supplierService.remove(id);
  }
}