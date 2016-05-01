var _ = require('underscore');

var test = {"anger":0.00141365023,"contempt":0.135682091,"disgust":0.002687466,"fear":0.000972979353,"happiness":0.00201999187,"neutral":0.147732645,"sadness":0.7094617,"surprise":0.0000294820275};

console.log(Object.keys(test).reduce(function(a, b){ return test[a] > test[b] ? a : b }));
