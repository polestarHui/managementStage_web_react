/**
 * @param startColor 开始颜色(rgb)
 * @param endColor 结束颜色（rgb）
 * @param limitArrow 当前占比（小数）0 - 1
 * */
export function getCurrentColorNums(startColor, endColor, limitArrow) {
  let startColorNums = getRgb(startColor);
  let endColorNums = getRgb(endColor);

  let rDivide = endColorNums[0] - startColorNums[0];
  let gDivide = endColorNums[1] - startColorNums[1];
  let bDivide = endColorNums[2] - startColorNums[2];

  let step = Math.max(Math.abs(rDivide), Math.abs(gDivide), Math.abs(bDivide));

  let rStep = rDivide / step;
  let gStep = gDivide / step;
  let bStep = bDivide / step;

  let nowSteps = limitArrow * step;

  let resultColorNums = [];
  resultColorNums.push(startColorNums[0] + Math.floor(rStep * nowSteps));
  resultColorNums.push(startColorNums[1] + Math.floor(gStep * nowSteps));
  resultColorNums.push(startColorNums[2] + Math.floor(bStep * nowSteps));

  return resultColorNums;
}

function getRgb(rgb) {
  let rgbNums = rgb
    .replace('rgb', '')
    .replace('(', '')
    .replace(')', '')
    .split(',');
  rgbNums = rgbNums.map(x => Number(x.trim()));
  return rgbNums;
}
