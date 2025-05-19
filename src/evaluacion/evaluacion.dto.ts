import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EvaluacionDto {
    @IsNumber()
    @IsNotEmpty()
    readonly notaFinal: number;

    @IsString()
    @IsNotEmpty()
    readonly retroalimentacion: string;
} 