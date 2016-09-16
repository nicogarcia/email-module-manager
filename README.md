# Stensul Email Modules

This app provides a real-time synchronized manager of [stensul](https://stensul.com)'s email modules

Live Demo: [stensul email module manager](https://email-module-manager.firebaseapp.com/)

## Development steps
1. Parse statement
  * Result:
  	* Models:
		```
		Item {
			picture     [size=(320,  320), type=(gif | jpeg | png)],
			description [max_length=300]
		}

  	* Available actions (all without refreshing the page):
  	  * Drag and drop sort
  	  * Item counter (auto updated)
  	  * Item edition
  	    * Picture upload
        * Description edit
  	  * Item deletion
  	  * Item insertion

  	* Requirements:
  	  * Item persistent storage

2. Make architectural decisions:
  * Use Firebase as backend for simplicity, ease of use, storage availability and deeper learning and practise interest.
  * Use npm to run tasks and install 3rd party libraries and tools.
  * Use Webpack to bundle all js, minify, version assets, build index.html and load libraries.
  * Link this demo project with stensul business to work on more real context using email modules as items.

3. Make design decisions:
  * Create Item and ItemCollection model to ease development and avoid errors
  * Create logic and display layers, all item updates are made in logic layer

3. Select tools:
  * Webstorm IDE
  * Git and GitHub
  * Firebase (BaaS)
  * Webpack (module bundler)
  * Chrome Inspector
  * JS, HTML, CSS, SASS (BEM)
  * Libraries:
    * Firebase for JS
    * Materialize CSS

4. Initialize project:
  * Create GitHub repo
  * Setup Git
  * Setup npm
  * Setup Webpack
  * Setup Firebase hosting and deploy

**Note:** *No 3rd party boilerplate or template was used for this project.*

5. Start development

6. Review code and add documentation

7. Push changes

**Note:** *None of git best practices (branching model, atomic commits, etc) will be applied, source will be pushed in bulk because of project size, team size and time restrictions*

## Installation instructions

Run:
```
# npm install -g firebase-tools
# npm install -g webpack
$ npm install
```

## Known issues

- Ugly alerts are used for validation errors
- Images are not removed from server when item is removed
- SPA is not mobile responsive
- MaterializeCSS SASS distribution could have been used to avoid presentational classes in HTML elements