import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProfesorDto {
    @IsNumber()
    @IsNotEmpty()
    readonly cedula: number;

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly departamento: string;

    @IsString()
    @IsNotEmpty()
    readonly facultad: string;
} 