export const ruleNumber = [
  (val: string | null | undefined) =>
    val === null ||
    val === undefined ||
    val === '' ||
    /^(0|[1-9]\d*)(\.\d{1,3})?$/.test(val) ||
    'Only numbers allowed',
];

export const ruleRequired = [
  (val: string) => !!val || 'This field is required',
];
