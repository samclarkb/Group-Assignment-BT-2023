# BT-2023-Project-Tech

## Table Of Contentes 
* [:bulb: Concept](https://github.com/samclarkb/BT-2023-Project-Tech#bulb-concept)
* [:star: Features](https://github.com/samclarkb/BT-2023-Project-Tech#star-features)
* [:wrench: Installation](https://github.com/samclarkb/BT-2023-Project-Tech#wrench-installation)
* [:mag_right: Recources](https://github.com/samclarkb/BT-2023-Project-Tech#mag_right-recources)
* [:bookmark: License](https://github.com/samclarkb/BT-2023-Project-Tech#bookmark-license)

## :bulb: Concept 
The application mainly focuses on enable users to find their favorite hip-hop albums. With the help of filters and a search function the user can look up a variety of hip-hop albums. When the user finds an album he/she seems to like, the user can click on the preview for some additional information about the album. The user is also able to like, delete or upload an ablum. 

## :star: Features 

<table>
  <tr>
    <td align="center" align="top"><h3>Lazy Loading</h3><p>Using the intersection obserever I implemented lazy loading for the image withing the album cards. When the card is within the view of the screen the album cover is being showed.</p><img width='247px' src='https://github.com/samclarkb/BT-2023-Project-Tech/blob/main/public/gif/lazyLoad.gif'></td>
    <td align="center" align="top"><h3>Delete</h3><p>The user can delete an ablum by pressing on the bin within the album card. After pressing on the bin the user has to confirm if he/she is certain about their action.</p><img width='247px' src='https://github.com/samclarkb/BT-2023-Project-Tech/blob/main/public/gif/delete.gif'></td>
    <td align="center" align="top"><h3>Upload</h3><p>The user is able to upload an album to the database by using the form. When the album is uploaded the user gets feedback. All the fields are requierd, so the user is unable to add an album without filling in all the fields.</p><img width='247px' src='https://github.com/samclarkb/BT-2023-Project-Tech/blob/main/public/gif/upload.gif'></td>
  </tr>
    <tr>
    <td align="center" align="top"><h3>Favorite</h3><p>When the user presses on the empty heart the user adds that specific album to their favorites list. at the favorites page the user sees an overview of al their favorites albums. The user can remove an album ot their favorites list by clicking on a full heart.</p><img width='247px' src='https://github.com/samclarkb/BT-2023-Project-Tech/blob/main/public/gif/favorite.gif'></td>
    <td align="center" align="top"><h3>Filter</h3><p>Here the user can filter by genre and year of origin. When the data is filtered the user get an overview of albums that corresponds with the user preverences. </p><img width='247px' src='https://github.com/samclarkb/BT-2023-Project-Tech/blob/main/public/gif/filter.gif'></td>
    <td align="center" align="top"><h3>Search</h3><p>Here the user can search by ablum title, artist name, genre and year. When the user search for something that doesn't correspond with data from the database, the app will give the user feedback. The user is also able to clear the search results by pressing the cross. </p>  <img width='247px' src='https://github.com/samclarkb/BT-2023-Project-Tech/blob/main/public/gif/search.gif'></td>
  </tr>
</table>

## :wrench: Installation 
If you want to use the app locally, you can clone my repository with the following commands:

`git clone https://github.com/samclarkb/BT-2023-Project-Tech`

Then install al the dependancies

`npm install`

After that you can run the project with the foolowing command:

`npm start`

## :mag_right: Recources 
* EJS -- Embedded JavaScript templates. (z.d.). https://ejs.co/
* Lazy loading images. (2019, 16 augustus). web.dev. https://web.dev/lazy-loading-images/
* Mongoose v7.0.1: Model. (z.d.). https://mongoosejs.com/docs/api/model.html
* npm: multer. (z.d.). npm. https://www.npmjs.com/package/multer
* npm: express-ejs-layouts. (z.d.). npm. https://npmjs.com/package/express-ejs-layouts
* @supports - CSS: Cascading Style Sheets | MDN. (2023, 21 februari). https://developer.mozilla.org/en-US/docs/Web/CSS/@supports
* Intersection Observer API - Web APIs | MDN. (2023, 28 februari). https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
* Progressive Enhancement: What It Is, And How To Use It? — Smashing Magazine. (2009, 22 april). Smashing Magazine. https://www.smashingmagazine.com/2009/04/progressive-enhancement-what-it-is-and-how-to-use-it/

## :bookmark: License 
Copyright (c) 2021 Sam Clark Boot, [MIT](https://github.com/samclarkb/BT-2023-Project-Tech/blob/main/LICENSE)



