export const toBengali = (num: number | string): string => {
  const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const bengali = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  return num.toString().split('').map(char => {
    const index = english.indexOf(char);
    return index > -1 ? bengali[index] : char;
  }).join('');
};

export type SerialFormat = 'english' | 'bengali' | 'roman' | 'alpha' | 'bengali_alpha';

export const formatSerial = (index: number, format: SerialFormat = 'bengali'): string => {
  const num = index + 1;
  switch (format) {
    case 'english':
      return num.toString();
    case 'alpha':
      return String.fromCharCode(96 + num); // a, b, c...
    case 'bengali_alpha':
      const bengaliChars = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ'];
      return bengaliChars[index % bengaliChars.length];
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

export const getBoardLabels = (board: string) => {
    if (board === 'CBSE') {
        return {
            totalMarks: 'Total Marks',
            time: 'Time',
            section: 'Section',
            question: 'Question',
            answerAny: 'Answer any',
            outOf: 'out of',
            questions: 'questions'
        };
    }
    // Default WB (Bengali)
    return {
        totalMarks: 'পূর্ণমান',
        time: 'সময়',
        section: 'বিভাগ',
        question: 'প্রশ্ন',
        answerAny: 'যে কোনো',
        outOf: 'টি প্রশ্নের উত্তর দাও (মোট',
        questions: 'টি)' // Complex phrasing adjustment handled in component usually
    };
};
