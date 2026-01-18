export const toBengali = (num: number | string): string => {
  const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const bengali = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  return num.toString().split('').map(char => {
    const index = english.indexOf(char);
    return index > -1 ? bengali[index] : char;
  }).join('');
};

export const getBengaliAlpha = (index: number) => {
    const letters = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ'];
    return letters[index] || toBengali(index + 1);
};

export const formatSerial = (index: number, format: string = 'bengali'): string => {
  const num = index + 1;
  switch (format) {
    case 'english':
      return num.toString();
    case 'english_alpha':
      return String.fromCharCode(97 + (index % 26));
    case 'bengali_alpha':
        return getBengaliAlpha(index);
    case 'roman':
        const lookup: {[key: string]: number} = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
        let roman = '';
        let i = num;
        for ( const key in lookup ) {
            while ( i >= lookup[key] ) {
                roman += key;
                i -= lookup[key];
            }
        }
        return roman.toLowerCase();
    case 'bengali':
    default:
      return toBengali(num);
  }
};
