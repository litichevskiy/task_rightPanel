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

		if ( countPage > theBlock.storagePage.length ) {
			theBlock.activeButtonForward( false );
			theBlock.step.setStepForward( false );
			return
		}

		var page = theBlock.storagePage[countPage +1];

		showSelectPage( theBlock.mainBlock, page );

		countPage += 1;
	}


	RightPanel.prototype.backward = function() {

		var checkStep = theBlock.step.isBackward();

		if ( checkStep ) {

			if ( countPage === 0 ) {
				theBlock.activeButtonBackward( false );
				theBlock.step.setStepBack( false );
				return
			}

			var page = theBlock.storagePage[countPage -1];

			showSelectPage( theBlock.mainBlock, page );

			theBlock.step.isForward( true );
			theBlock.activeButtonForward( true );

			theBlock.activeButtonHome( true );
			theBlock.step.setIsHome( true );

			countPage -= 1;

		}
	};

	RightPanel.prototype.activeButtonForward = function( _boolean ) {

		if ( _boolean ) {

			theBlock.forward.classList.add( ACTIVE );

		} else theBlock.back.classList.remove( ACTIVE );
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

		if (this.storagePage.length >= 2) {

			theBlock.step.setStepForward( true );
			theBlock.activeButtonBackward( true );

		}

		var index = this.storagePage.indexOf( page );

		if ( index !== -1 ) {

			this.storagePage.splice( index, 1 );
			this.storagePage.push( page );
		}

		if ( index === -1 ) this.storagePage.push( page );

		var currentPage = this.mainBlock.children[0];

		if ( currentPage === page ) throw new Error('This page is displayed');

		if ( currentPage ) {

			this.mainBlock.replaceChild( page , currentPage );
			return page;
		}

		this.mainBlock.appendChild( page );

		countPage = this.storagePage.length;

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

			if ( index !== -1 ) {

				this.storagePage.splice( index, 1 );
				countPage = this.storagePage.length;
				this.backward();
			}
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