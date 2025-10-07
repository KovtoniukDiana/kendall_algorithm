import React from 'react'
import SumArr from './sum_arr';

export default function MeanArr(arr) {

    if(arr.length > 0 ) {
        return (SumArr(arr) / arr.length).toFixed(4);
    }else return console.error("Array length is zero");
}
