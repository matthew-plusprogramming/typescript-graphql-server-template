interface graphqlGeneratorArgs {
  nameCapitalCase: string,
  inputType?: string,
  returnSignature: string
}

export const generateMutation = ({
  nameCapitalCase,
  inputType,
  returnSignature
}: graphqlGeneratorArgs): string => `
mutation ${nameCapitalCase}${inputType ? `($data: ${inputType}!)` : ''} {
  ${nameCapitalCase.toLowerCase()}${inputType ? '(data: $data)' : ''} {
    ${returnSignature}
  }
}
`;

export const generateQuery = ({
  nameCapitalCase,
  inputType,
  returnSignature
}: graphqlGeneratorArgs): string => `
query ${nameCapitalCase}${inputType ? `($data: ${inputType}!)` : ''} {
  ${nameCapitalCase.toLowerCase()}${inputType ? '(data: $data)' : ''} {
    ${returnSignature}
  }
}
`;
