import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../base/dtos/api-response.dto';
import { PaginatedResponse } from '../base/dtos/paginated-response.dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                allOf: [{ $ref: getSchemaPath(PaginatedResponse(model)) }],
              },
            },
          },
        ],
      },
    }),
  );
};
