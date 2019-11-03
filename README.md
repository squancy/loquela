# loquela
Loquela is mainly written in JavaScript with some additional HTML and CSS.


## Features & How It Works?
There are [english word]-[mother tongue word] pairs and the app will ask one of the words in a pair randomly and the user has to type in the correct counterpart in order to proceed.<br>
If the user does not know the answer they can check it by clicking the <b>Show solution</b> button.

When first using Loquela a default wordlist (currently `words.txt`</b>) will serve as a data source but the user has the ability to add their own words later on.

The user can also check their <b>correct words</b> and <b>missed words</b>.

## Implementation
Loquela uses the `fetch API` available in ES6 to fetch local files on the server and the `Promise API` for utilization.<br>
The words added by the user are stored in the `localStorage` on the client side so no server-side interaction occurs.<br>
Therefore when executing `localStorage.clear()` in DevTools or clearing the cache and local storage all the previously added words will get lost.

## Example sentences
When Loquela is asking an [english word]'s counterpart it will search a large text file (`xaa.txt` and `xab.txt`) for an example sentence in English with the given word in it.<br>
The search is done with JavaScript's `RegExp` object and once the files are fetched the search takes around 0.1 seconds complete.<br>
<b>Note:</b> in the source code the name of the file containing the sentences is `sentence.txt` but since it is quite large (around 45MB) it is split into two halves (`xaa.txt` and `xab.txt`).<br>
When playing with the source code please account for this change.

## Commands
In the main text input field you can write:
  - `__defaultmode__` to use the default file (currently `words.txt`) as an input
  - `__custommode__` to use the words that the user added (the one that is stored in `localStorage`)

## Contribute
If you have any questions or suggestions drop me with an emal at <a href="mailto:mark@pearscom.com">mark@pearscom.com</a>.<br>
For a hands on experience visit <a href="https://www.pearscom.com/loquela">pearscom.com/loquela</a>
