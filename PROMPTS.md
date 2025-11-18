AI Prompt Documentation for This Project

This document contains all prompts used during development, along with context and explanations of how AI assistance contributed to each feature, bug fix, or architectural decision.
This is required to demonstrate the problem-solving approach and how AI tools supported the project.

1. Project Setup & Architecture
   Prompt

“Can you help me design the architecture for a Jikan API request handler with rate limiting?”

Context

I needed guidance on structuring the entire API handling layer, including rate limiting and long-term stability when making calls to Jikan API.

AI Assistance

AI helped evaluate multiple strategies (queue system, interceptors, wrapper functions) and guided the architecture for applying fixed delays between requests in compliance with Jikan API rules.

2. Implementing Rate-Limit Request Queue
   Prompt

“Can you fix this code?” (followed by the full rate-limit + retry logic)

Context

The rate-limit queue was not working correctly. Some requests were skipped or executed too quickly, causing 429 errors.

AI Assistance

AI helped by:

spotting logical issues in queue processing

enforcing spacing between API calls

integrating retry logic with delay

preventing parallel requests

refactoring searchAnime() and getAnimeDetails() to use the queue

This produced the final functional rate-limit system used in the project.

3. Clarifying Jikan API Integration / Build Problem
   Prompt

“Why is my system not building?”
“Just provide the problem not building this system.”

Context

The project build pipeline required a PROMPTS.md file. Without it, validation failed.

AI Assistance

AI identified that the missing documentation file was the cause of build failure and explained that the project requires submitting all prompts used during development.

4. Code Explanation & Refactoring
   Prompt

“Can you explain what’s wrong with my fetchWithRetry / queue logic?”

Context

Some internal functions behaved unexpectedly, especially handling retry + delay + AbortSignal.

AI Assistance

AI clarified:

how 429 retry interacts with the queue

error propagation issues

correct handling of AbortError

logic ordering inside the queue

This improved error reliability and prevented incorrect re-execution of requests.

5. Header and Logo Integration
   Prompt

“i want to put logo

<header className='bg-gray-800 text-white p-4 shadow-lg'>...</header>
```”

### **Context**

I wanted a header that included both title and logo.

### **AI Assistance**

AI generated the final header:

```html
<header className="bg-gray-800 text-white p-4 shadow-lg flex items-center space-x-3">
  <img src="/logo.png" alt="Logo" className="w-10 h-10" />
  <h1 className="text-2xl font-bold tracking-wide">Anime Collection</h1>
</header>


File updated:
src/components/Header.tsx

6. Adjusting Logo Size
Prompt

“can you make the image size ?”

Context

The logo appeared too big or visually unaligned.

AI Assistance

AI suggested sizing utilities like w-10 h-10 and optional object-contain to maintain aspect ratio.

7. Improving Heading Typography
Prompt

“what the best style for my h1 ?”

Context

Wanted a more modern, clean typographic style.

AI Assistance

AI recommended:

<h1 className="text-3xl font-bold tracking-wide text-white">Anime Collection</h1>


With optional gradient or shadow for contrast.

8. Redux Error – Missing Export
Prompt

“Module '../features/animeSearch/animeSearchSlice' has no exported member 'setSelectedAlphabet'”

Context

I received an error after adding an alphabet filter action.

AI Assistance

AI identified the missing export and fixed it by adding:

export const {
  setSearchTerm,
  setSelectedAlphabet,
  setCurrentPage,
  clearSearchResults
} = animeSearchSlice.actions;


File updated:
src/features/animeSearch/animeSearchSlice.ts

9. Implementing Filter by First Alphabet
Prompt

“i need it filter by first alphabet among the title”

Context

Jikan API does not support first-letter search, so filtering needed to be handled client-side.

AI Assistance

AI provided:

const filteredResults = results.filter(
  (anime) => anime.title.toUpperCase().startsWith(selectedAlphabet.toUpperCase())
);


File updated:
src/pages/SearchPage.tsx

10. Clear Button for Alphabet Filter
Prompt

“can we add clear button after we click on alphabet ?”

Context

Needed to reset the selected alphabet easily.

AI Assistance

AI added:

<button
  onClick={() => dispatch(setSelectedAlphabet(''))}
  className="ml-2 text-sm text-blue-600 hover:underline"
>
  Clear
</button>


File updated:
src/components/AlphabetFilter.tsx

11. Search Page Header Improvement
Prompt

“Can you make it proper for user know the function?”

Context

Wanted clearer messaging on the search page.

AI Assistance

AI improved the header:

<h2 className="text-4xl font-extrabold mb-4 text-center text-gray-800">Discover Anime</h2>
<p className="text-center text-gray-600 mb-8">Search by title or filter by the first alphabet.</p>


File updated:
src/pages/SearchPage.tsx

12. Pagination Count Wrong
Prompt

“For the page amount, i think it getting wrong.”

Context

Some searches returned incorrect pagination values.

AI Assistance

AI recommended using:

pagination.has_next_page

fallback handling when Jikan data is incomplete

This improved pagination accuracy.

13. Add Clear (X) Button to Search Bar
Prompt

“i want to put clear x button”

Context

Wanted users to quickly clear the search input.

AI Assistance

AI added an absolute-positioned close button:

<div className="relative">
  <input ... />
  {searchTerm && (
    <button
      onClick={clearInput}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      ✕
    </button>
  )}
</div>


File updated:
src/components/SearchBar.tsx

14. PWA Setup & Favicon Issue
Prompt

“logo cannot change in pwa for the tab logo
im using vitepwa”

Context

The PWA icon wasn’t updating after replacing logos.

AI Assistance

AI added and explained:

<link rel="icon" type="image/png" href="/logo.png" />
<meta name="theme-color" content="#111827" />


Also recommended clearing browser cache + reinstalling PWA.

Files updated:
index.html
vite.config.ts

15. Alphabet Filter Redux Integration
Prompt

“filter not exactly correct, when i search p, it show the other alphabet too”

Context

Filtering was incorrect due to multiple overlapping states.

AI Assistance

AI debugged the reducer logic, unified the filtering flow, and ensured the alphabet filter was applied after fetching results — not before.

File updated:
src/pages/SearchPage.tsx
```
