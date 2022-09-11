window.utils = {
  currFy: 'fy23'
};



window.utils.handleError = (error) => {
  if(error == 0)
    alert(error);
}



window.utils.formatDate = (date) => {
  return date || '-';
}

window.utils.formatNumber = (number, d = 0) => {

  if(!number || Math.abs(number) < 0.0001)
    return '-';

  number = Math.round(number * Math.pow(10, d));

  let numberStr = Math.abs(number) + '';
  let l = numberStr.length;
  for(; l < d; l++)
    numberStr = '0' + numberStr;

  if(l == d)
    numberStr = '0.' + numberStr;
  else if(l <= 3 + d)
    numberStr = numberStr.substring(0, l - d) + (d ? '.' + numberStr.substring(l - d) : '');
  else if(l <= 5 + d)
    numberStr = numberStr.substring(0, l - 3 - d) + ',' + numberStr.substring(l - 3 - d, l - d) + (d ? '.' + numberStr.substring(l - d) : '')
  else
    numberStr = numberStr.substring(0, l - 5 - d) + ',' + numberStr.substring(l - 5 - d, l - 3 - d) + ',' + numberStr.substring(l - 3 - d, l - d) + (d ? '.' + numberStr.substring(l - d) : '');
  
  return (number < 0 ? '-' : '') + numberStr;

}

window.utils.formatPercentage = (amount, d = 0) => {
  let f = window.utils.formatNumber(amount * 100, d);
  return f == '-' ? f : f + '%';
}

window.utils.formatCurrency = (amount, d = 0) => {
  let f = window.utils.formatNumber(Math.abs(amount), d);
  if(f == '-')
    return '-';
  return amount < 0 ? ('- ₹' + f) : ('₹' + f);
}

window.utils.format = (val, type) => {
  if(!type)
    return val;
  if(type == 'date')
    return window.utils.formatDate(val);
  if(type == 'number')
    return window.utils.formatNumber(val, 0);
  if(type == 'number2d')
    return window.utils.formatNumber(val, 2);
  if(type == 'number3d')
    return window.utils.formatNumber(val, 3);
  if(type == 'percentage2d')
    return window.utils.formatPercentage(val, 2);
  if(type == 'currencyInr')
    return window.utils.formatCurrency(val, 0);
  if(type == 'currencyInr2d')
    return window.utils.formatCurrency(val, 2);
  return val;
}



window.utils.cssYellowGradient = (amount, min, max) => {
  if(amount == null || min == max)
    return '';
  // if(amount < min)
    // return yellow lighten-5';
  if(amount <= min + (max - min) / 10 * 1)
    return 'yellow lighten-5';
  if(amount <= min + (max - min) / 10 * 2)
    return 'yellow lighten-4';
  if(amount <= min + (max - min) / 10 * 3)
    return 'yellow lighten-3';
  if(amount <= min + (max - min) / 10 * 4)
    return 'yellow lighten-2';
  if(amount <= min + (max - min) / 10 * 5)
    return 'yellow lighten-1';
  if(amount <= min + (max - min) / 10 * 6)
    return 'yellow';
  if(amount <= min + (max - min) / 10 * 7)
    return 'yellow darken-1';
  if(amount <= min + (max - min) / 10 * 8)
    return 'yellow darken-2';
  if(amount <= min + (max - min) / 10 * 9)
    return 'yellow darken-3';
  // if(amount <= max )
    return 'yellow darken-4 grey--text text--lighten-4';
}

window.utils.cssRedGreenGradient = (amount, min, max, mid = 0) => {
  if(amount < mid - (mid - min) / 10 * 9)
    return 'deep-orange darken-4 grey--text text--lighten-4';
  if(amount < mid - (mid - min) / 10 * 8)
    return 'deep-orange darken-3';
  if(amount < mid - (mid - min) / 10 * 7)
    return 'deep-orange darken-2';
  if(amount < mid - (mid - min) / 10 * 6)
    return 'deep-orange darken-1';
  if(amount < mid - (mid - min) / 10 * 5)
    return 'deep-orange';
  if(amount < mid - (mid - min) / 10 * 4)
    return 'deep-orange lighten-1';
  if(amount < mid - (mid - min) / 10 * 3)
    return 'deep-orange lighten-2';
  if(amount < mid - (mid - min) / 10 * 2)
    return 'deep-orange lighten-3';
  if(amount < mid - (mid - min) / 10 * 1)
    return 'deep-orange lighten-4';
  if(amount < mid - 0.00001)
    return 'deep-orange lighten-5';
  if(amount < mid + 0.00001)
    return '';
  if(amount <= mid + (max - mid) / 10 * 1)
    return 'light-green lighten-5';
  if(amount <= mid + (max - mid) / 10 * 2)
    return 'light-green lighten-4';
  if(amount <= mid + (max - mid) / 10 * 3)
    return 'light-green lighten-3';
  if(amount <= mid + (max - mid) / 10 * 4)
    return 'light-green lighten-2';
  if(amount <= mid + (max - mid) / 10 * 5)
    return 'light-green lighten-1';
  if(amount <= mid + (max - mid) / 10 * 6)
    return 'light-green';
  if(amount <= mid + (max - mid) / 10 * 7)
    return 'light-green darken-1';
  if(amount <= mid + (max - mid) / 10 * 8)
    return 'light-green darken-2';
  if(amount <= mid + (max - mid) / 10 * 9)
    return 'light-green darken-3';
  // if(amount <= max )
    return 'light-green darken-4 grey--text text--lighten-4';
}
