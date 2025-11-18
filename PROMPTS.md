# PROMPTS.md

**Project:** Anime Search app
**Developer:** Arham Syafiq  
**AI Assistant:** Google Studio & ChatGPT

---

## 📘 About This Document

This document records all AI-assisted interactions used during the development of this project.  
It outlines every **prompt**, **response context**, and **feature contribution** guided by AI tools.

Using AI effectively is part of this project’s evaluation requirement.  
All AI suggestions were reviewed, modified, and tested manually before integration.

---

## 🧠 Summary of AI Involvement

| Area            | Description                                                           | Files Involved                              |
| --------------- | --------------------------------------------------------------------- | ------------------------------------------- |
| Header & UI     | Added logo, improved heading, and applied Tailwind CSS design         | `Header.tsx`, `SearchPage.tsx`              |
| Search Bar      | Added input, clear button, and placeholder handling                   | `SearchBar.tsx`                             |
| Alphabet Filter | Created interactive alphabet filtering system with clear/reset option | `AlphabetFilter.tsx`, `animeSearchSlice.ts` |
| Redux Slice     | Managed search term, alphabet, and pagination logic                   | `animeSearchSlice.ts`, `store.ts`           |
| Pagination      | Debugged wrong page count and API next page logic                     | `SearchPage.tsx`                            |
| Vite PWA        | Verified manifest setup, favicon issue, and metadata                  | `vite.config.ts`, `index.html`              |
| PROMPTS.md      | Generated this documentation file                                     | `PROMPTS.md`                                |

---

## 🧩 Full Prompt Log

### 1. Initial UI Layout and Search Results Grid

**Prompt**

> {results.length > 0 && ( ... ) }  
> i need this to show anime search result properly in grid

**Context**
Anime results were not aligned correctly in grid layout.

**AI Assistance**
ChatGPT suggested replacing the layout with a responsive Tailwind grid:

```jsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-6">
```
