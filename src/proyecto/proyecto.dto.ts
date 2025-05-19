import { IsNotEmpty, IsNumber, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class ProyectoDto {
    @IsString()
    @IsNotEmpty()
    readonly titulo: string;

    @IsString()
    @IsNotEmpty()
    readonly area: string;

    @IsNumber()
    @IsNotEmpty()
    readonly presupuesto: number;

    @IsNumber()
    @IsNotEmpty()
    readonly notaFinal: number;

    @IsNumber()
    @IsNotEmpty()
    readonly estado: number;

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    readonly fechaInicio: Date;

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    readonly fechaFin: Date;
} 