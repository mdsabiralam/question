export const toBengali = (num: number | string): string => {
  const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const bengali = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  return num.toString().split('').map(char => {
    const index = english.indexOf(char);
    return index > -1 ? bengali[index] : char;
  }).join('');
};

export const formatSerial = (index: number, format: 'english' | 'bengali' | 'roman' = 'bengali'): string => {
  const num = index + 1;
  switch (format) {
    case 'english':
      return num.toString();
    case 'roman':
        // Simple roman numeral implementation for small numbers
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
