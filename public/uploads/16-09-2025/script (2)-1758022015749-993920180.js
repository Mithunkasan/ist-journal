// Reverse a string without using built-in methods.
// function reverseString(str){
//     let reversed = ""
//     for (let i=str.length-1;i>=0;i--){
//         console.log(str[i])
//         reversed=reversed+ str[i]
//     }
    
//     return reversed
    
// }

// console.log(reverseString("hello"))

// Find the largest and smallest number in an array.

// const arr=[10,5,6,8,9,1,25,5]

// const maxnumber=Math.max(...arr)

// const minnumber=Math.min(...arr)

// console.log("max",maxnumber,"min",minnumber)

// Check if a string is a palindrome.

// function ispalindrome(str){

//     const reversed=str.split("").reverse().join("")

//     return str ===reversed

// }

// console.log(ispalindrome("malayalam"))


// Count the number of vowels in a string.

// function vowelsChecker(str){
//   let count =0
//   let vowels="aeiouAEIOU"

//   for (let i=0;i<str.length;i++){
//     if(vowels.includes(str[i])){
//         count++
//     }
//   }
//       return count

// }

// console.log(vowelsChecker("tamil"))

// function vowelsChecker(str){
//     const matches=str.match(/[aeiou]/gi)
//     return matches ? matches.length :0
// }

// console.log(vowelsChecker("tamil"))

// Remove duplicates from an array
// const arr=[1,2,1,5,4,5,2,2,3,4]

// const duplicates=arr.filter((num,index)=>arr.indexOf(num)!== index)

// const removedduplicates=[...new Set(arr)]



// console.log(duplicates)
// console.log(removedduplicates)

// Write a function to check if two strings are anagrams.
// function anagram(str1,str2){
//     const reverse=str1.split("").sort().join("")
//     const reverse1=str2.split("").sort().join("")
//     return reverse ===reverse1
// }

// console.log(anagram("hello","hll"))


// 

// Implement a function to flatten a nested array.

// const arr=[1,2,[1,2],[2,3,4]]

// const flatten=arr.flat(Infinity)
// const sumvalue=flatten.reduce((num,acc)=>num +acc,0)

// console.log(flatten)
// console.log(sumvalue)

// const arr=[1,2,[1,2],[2,3,4]]

// function flattenarray(arr){
// let flatted=[]
// for(i=0;i<arr.length;i++){
//     if(Array.isArray(arr[i])){
//         flatted=flatted.concat(flattenarray(arr[i]))
//     }else{
//         flatted.push(arr[i])
//     }
// }


// return flatted
// }

// const flat=flattenarray(arr)
// const sumofall=flat.reduce((num,acc)=>num + acc,0)
// console.log(sumofall)
// console.log(flat)

// * Find the second largest number in an array.

// const arr=[10,5,6,8,9,1,25,5]


// const sorted=arr.sort((a,b)=>b-a)
// const secondlargest=sorted[1]
// console.log(sorted,"secondlargest",secondlargest)

// const arr=[10,5,6,8,9,1,25,5]


// let largest=-Infinity
// let secondlargest=-Infinity

// for(let i=0;i<arr.length;i++){
//     if(arr[i]>largest){
//         secondlargest=largest
//         largest=arr[i]
//     }else if(arr[i]>largest && largest!==arr[i]){
//         secondlargest=arr[i]

//     }
// }

// console.log(secondlargest)

// Write a function to get factorial of a number.

// function factorial(n){
//     let result=1

//     for(let i=1;i<=n;i++){
//          result *=i
        
//     }
//     console.log(result)
// return result
// }

// console.log(factorial(5))
// function factorial(n){
//     if(n==0 || n==1)return 1

//     return n *factorial(n-1)
// }

// console.log(factorial(5))

// Write a function to check if a number is prime.

// function primechecker(n){
//     if(n===0 || n===1) return false


//     for(let i=2;i<=n;i++){
//         if(n % i===0){
//             return true
//         }

//         return false
//     }

// }

// console.log(primechecker(3))

// function reverseString(str){
//     let reversed=""
//     for(let i=str.length-1;i>=0;i--){
//         reversed+=str[i]
//     }
//     return reversed
// }

// console.log(reverseString("hello"))

// const arr = [10, 5, 6, 8, 9, 1, 25, 5];

// let largest=arr[0]  
// let smallest=arr[0]

// for(let i=1;i<=arr.length;i++){
//     if(arr[i]>largest){
//         largest=arr[i]
//     }else if(arr[i]<smallest){
//         smallest=arr[i]
//     }

    
// }

// console.log(smallest,largest)

// function ispalindrome(str){
//     const reverse=str.split("").reverse().join("")
//     return reverse===str
// }

// console.log(ispalindrome(("malayalam")))

// function ispalindrome(str){
//     let cleaned=str.toLowerCase()
//     for(let i=0;i<Math.floor(cleaned.length/2);i++){
//         if(cleaned[i]!=cleaned[cleaned.length-1-i]){
//             return false
//         }

//     }
//     return true
// }

// console.log(ispalindrome("malayalam"))