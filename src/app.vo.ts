import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class ConsentCheckRequest {
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsString()
  scope: string;
}

export class ConsentCheckResponse {
  @IsNotEmpty()
  @IsBoolean()
  success: boolean;

  predicates: any[];
}

