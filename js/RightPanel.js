(function( exports ){

	const
		ACTIVE = 'active';

	var theBlock;
	var countPage = 0;

	function RightPanel( obj ) {

		if ( !obj.container || !obj.mainBlock ) {
			throw new Error('module requires containers');
		}

		if ( theBlock ) {
			return theBlock;
		}
		theBlock = this;

		this.storagePage = [];
		this.container = obj.container;
		this.mainBlock = obj.mainBlock;
		this.homePage = obj.homePage || null;

		this.home = this.container.querySelector('[data-role="home"]');
		this.back = this.container.querySelector('[data-role="back"]');
		this.forward = this.container.querySelector('[data-role="forward"]');

		this.home.addEventListener( 'click', checkHomePage );
		this.back.addEventListener( 'click', this.backward );
		this.forward.addEventListener( 'click', checkForward );

		if ( this.homePage ) {
			this.storagePage.push( this.homePage );
		}
	};


	function getNextPage( storage, count, parentElem ) {

		var page = storage[count];

		showSelectPage( parentElem, page );
	};


	function checkForward() {

		var check = theBlock.step.isForward();

		if ( check ) return theBlock.stepForward();
	};


	function checkHomePage() {

		var check = theBlock.step.getIsHome();

		if ( check ) return theBlock.showHomePage();
	}

	function showSelectPage( parentBlock, selectPage ) {

		parentBlock.innerHTML = '';
		parentBlock.appendChild( selectPage );
	};


	RightPanel.prototype.stepForward = function() {

		countPage += 1;

		if ( countPage === theBlock.storagePage.length -1 ) {
			theBlock.activeButtonForward( false );
			theBlock.step.setStepForward( false );

			getNextPage( theBlock.storagePage, countPage, theBlock.mainBlock );
			return;
		}

		if ( this.storagePage.length >= 2 ) {
				theBlock.step.setStepBack( true );
				theBlock.activeButtonBackward( true );
			}
		getNextPage( theBlock.storagePage, countPage, theBlock.mainBlock );
	};


	RightPanel.prototype.backward = function() {

		countPage -= 1;

		var checkStep = theBlock.step.isBackward();

		if ( checkStep ) {

			if ( countPage === 0 ) {

				theBlock.activeButtonBackward( false );
				theBlock.step.setStepBack( false );

				theBlock.step.setStepForward( true );
				theBlock.activeButtonForward( true );

				getNextPage( theBlock.storagePage, countPage, theBlock.mainBlock );
				return
			}

			getNextPage( theBlock.storagePage, countPage, theBlock.mainBlock );

			theBlock.step.isForward( true );
			theBlock.activeButtonForward( true );

			theBlock.activeButtonHome( true );
			theBlock.step.setIsHome( true );
		}
	};


	RightPanel.prototype.activeButtonForward = function( _boolean ) {

		if ( _boolean ) {

			theBlock.forward.classList.add( ACTIVE );

		} else theBlock.forward.classList.remove( ACTIVE );
	};


	RightPanel.prototype.activeButtonHome = function( _boolean ) {

		if ( _boolean && theBlock.homePage ) {

			theBlock.home.classList.add( ACTIVE );

		} else this.back.classList.remove( ACTIVE );
	}


	RightPanel.prototype.showHomePage = function() {

		if ( this.homePage ) {

			var currentPage = this.mainBlock.children[0];

			if ( !currentPage ) return console.error('currentPage is not defined');

			this.mainBlock.replaceChild( this.homePage, currentPage );

		} else console.error('Home page is not set');

	};


	RightPanel.prototype.activeButtonBackward = function( _boolean ) {

		if ( _boolean ) {

			this.back.classList.add( ACTIVE );
			return;

		} else this.back.classList.remove( ACTIVE );
	}


	RightPanel.prototype.addPage = function ( page ) {

		if ( !page ) return;

		if ( this.storagePage.length >= 2 ) {

			theBlock.step.setStepBack( true );
			theBlock.activeButtonBackward( true );

			theBlock.step.setStepForward( true );
		}

		this.storagePage.push( page );

		var currentPage = this.mainBlock.children[0];

		if ( currentPage === page ) console.error('This page is displayed');

		if ( currentPage ) {

			this.mainBlock.replaceChild( page , currentPage );
			countPage = this.storagePage.length -1;

			return page;
		}

		this.mainBlock.appendChild( page );

		countPage = this.storagePage.length -1;

		return page;
	};


	RightPanel.prototype.removePage = function( page ) {

		if ( !page ) return;

		var currentPage = this.mainBlock.children[0];

		if ( currentPage !== page ) {

			var index = this.storagePage.indexOf( page );

			if ( index !== -1 ) {

				this.storagePage.splice( index, 1 );
				countPage = this.storagePage.length;
				return;
			}
			if ( index === -1 ) {

				console.error('This page not found');
			}
			return;
		}

		if ( currentPage === page ) {

			this.mainBlock.removeChild( currentPage );

			var index = this.storagePage.indexOf( page );

			var nextPage = this.storagePage[index -1] || null;

			if ( index !== -1 ) {

				this.storagePage.splice( index, 1 );
				countPage = this.storagePage.length;
				this.backward();
			}

			if ( !nextPage ) return console.error('Previous page not found');

			showSelectPage( this.mainBlock, nextPage );
		}

	};


	RightPanel.prototype.step = (function() {

		var stepBack = false;
		var stepForward = false;
		var isHome = false;

		return  {

			isBackward : function() {
				return stepBack;
			},

			isForward : function() {
				return stepForward;
			},

			getIsHome : function() {
				return isHome;
			},

			setIsHome : function( _boolean ) {
				isHome = _boolean;
			},

			setStepBack : function ( _boolean ) {
				stepBack = _boolean;
			},

			setStepForward : function( _boolean ) {
				stepForward = _boolean;
			}
		}

	})();


	RightPanel.prototype.getHomePage = function() {

		if ( this.homePage ) return this.homePage;
		else return null;
	};


	RightPanel.prototype.setHomePage = function( page ) {
		this.homePage = page;
	};


	RightPanel.prototype.isHomePage = function() {

		if ( theBlock.homePage ) return true;
		else return false;
	};


	RightPanel.prototype.isPage = function( page ) {

		if ( !page ) return;

		var index = this.storagePage.indexOf( page );

		if ( index !== -1 ) return true;
		else return false;
	};


	RightPanel.prototype.inFocus = function( page ) {

		var currentPage = this.mainBlock.children[0];

		if ( currentPage === page ) return true;
		else return false;
	};


	exports.RightPanel = RightPanel;

})( window );