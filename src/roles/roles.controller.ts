import { Controller, Get, Post, Body, Delete, Param, Headers, Patch , Req } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    create(
        @Body() createRoleDto: any,
        @Req() req: any
    ) {
        return this.rolesService.create(createRoleDto, req.user);
    }

    // Pegamos o header Authorization que veio do Front-end
    @Get()
    findAll(@Req() req: any) {
        return this.rolesService.findAll(req.user);
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Req() req: any) {
        return this.rolesService.findOne(+id, req.user);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateRoleDto: any,
        @Req() req: any) {
        return this.rolesService.update(+id, updateRoleDto, req.user);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.rolesService.remove(+id, req.user);
    }
}