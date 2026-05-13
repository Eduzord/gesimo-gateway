import { Controller, Get, Post, Body, Delete, Param, Headers, Patch } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    create(
        @Body() createRoleDto: any,
        @Headers('authorization') authHeader: string
    ) {
        return this.rolesService.create(createRoleDto, authHeader);
    }

    // Pegamos o header Authorization que veio do Front-end
    @Get()
    findAll(@Headers('authorization') authHeader: string) {
        return this.rolesService.findAll(authHeader);
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Headers('authorization') authHeader: string) {
        return this.rolesService.findOne(+id, authHeader);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateRoleDto: any,
        @Headers('authorization') authHeader: string) {
        return this.rolesService.update(+id, updateRoleDto, authHeader);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Headers('authorization') authHeader: string) {
        return this.rolesService.remove(+id, authHeader);
    }
}