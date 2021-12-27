export const generateMutation = (
  nameCapitalCase: string,
  inputType: string,
  returnSignature: string
): string => `
mutation ${nameCapitalCase}($data: ${inputType}!) {
  ${nameCapitalCase.toLowerCase()}(data: $data) {
    ${returnSignature}
  }
}
`;
