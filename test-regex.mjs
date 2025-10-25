// 正規表現のテスト

const pattern1 = "治る|治す|治療|治癒|完治";
const pattern2 = "糖尿病を|糖尿病に効く";

const text = "この商品で糖尿病が治ります";

console.log('Text:', text);
console.log('\nPattern 1:', pattern1);
console.log('Match 1:', text.match(new RegExp(pattern1, 'gi')));

console.log('\nPattern 2:', pattern2);
console.log('Match 2:', text.match(new RegExp(pattern2, 'gi')));

// より柔軟なパターンでテスト
const pattern3 = "糖尿病[をがに]";
console.log('\nPattern 3 (flexible):', pattern3);
console.log('Match 3:', text.match(new RegExp(pattern3, 'gi')));

const pattern4 = "治[るりします]+";
console.log('\nPattern 4 (conjugation):', pattern4);
console.log('Match 4:', text.match(new RegExp(pattern4, 'gi')));
