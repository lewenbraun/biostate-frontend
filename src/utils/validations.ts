export const ruleNumber = [
  (val: string | null | undefined) =>
    val === null ||
    val === undefined ||
    val === '' ||
    /^\d+(\.\d{1,2})?$/.test(val) ||
    'Only numbers allowed',
];

export const ruleRequired = [
  (val: string) => !!val || 'This field is required',
];
