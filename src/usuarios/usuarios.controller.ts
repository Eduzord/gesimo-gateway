import { Controller, Get, Post, Body, Delete, Param, Headers, Patch , Req, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('usuarios')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Post()
    create(@Body() createUsuarioDto: any) {
        return this.usuariosService.create(createUsuarioDto);
    }

    // Pegamos o header Authorization que veio do Front-end
    @Get()
    findAll(@Req() req: any) {
        return this.usuariosService.findAll(req.user);
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Req() req: any) {
        return this.usuariosService.findOne(+id, req.user);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateUsuarioDto: any,
        @Req() req: any) {
        return this.usuariosService.update(+id, updateUsuarioDto, req.user);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.usuariosService.remove(+id, req.user);
    }

    @Delete(':id/hard')
    removeHard(@Param('id') id: string, @Req() req: any) {
        if (!req?.user || req.user.role !== 'ADMIN') {
            throw new UnauthorizedException('Acesso negado. Apenas ADMIN pode realizar esta ação.');
        }

        return this.usuariosService.removeHard(+id, req.user);
    }
}