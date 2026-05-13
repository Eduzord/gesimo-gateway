import { Controller, Get, Post, Body, Delete, Param, Headers, Patch } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Post()
    create(@Body() createUsuarioDto: any) {
        return this.usuariosService.create(createUsuarioDto);
    }

    // Pegamos o header Authorization que veio do Front-end
    @Get()
    findAll(@Headers('authorization') authHeader: string) {
        return this.usuariosService.findAll(authHeader);
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Headers('authorization') authHeader: string) {
        return this.usuariosService.findOne(+id, authHeader);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateUsuarioDto: any,
        @Headers('authorization') authHeader: string) {
        return this.usuariosService.update(+id, updateUsuarioDto, authHeader);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Headers('authorization') authHeader: string) {
        return this.usuariosService.remove(+id, authHeader);
    }
}