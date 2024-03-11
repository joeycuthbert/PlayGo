class Board{
    constructor(rows, cols, player){
        this.rows = rows;
        this.cols = cols;
        this.player = player; 

        this.pts = new Array((rows) * (rows)).fill(null);

        this.blackScore = 0;
        this.whiteScore = 0;
        
    }
  
    getPts(){
        return this.pts; 
    }

    setPoint(row, col, piece){
        this.pts[(row * this.cols) + col] = piece; 
    }

    changePlayer(){
        this.player = 1 - this.player; 
    }

    rowOf(move) {
		return (move - this.colOf(move)) / this.rows;
	}
	
	colOf(move) {
		return move % this.cols; 
	}

    occupiedHuh(move){
        return this.pts[move] == 0 || this.pts[move] == 1; 
    }

    getLoc(row, col){
        return (row * this.rows) + col; 
    }

	/*
	 * given a location for a piece in the pts[] array, a vertical and horizontal direction to check
	 * and a piece color, determine if the piece is touching a piece of opposite color in the given direction
	 * WHEN USNG THIS METHOD:
	 *			vDir and hDir should be either -1, 0, or 1
	 *			if vDir != 0, then hDir should equal 0 and vice versa
	 *
	 * original is true if it is the top-level, very first call from checkSurr() itself
	 */

   checkSurrInDir(loc, vDir, hDir, color, checked){

        let listPos = loc + (vDir * this.cols) + hDir; 

		if (this.offBoard(loc, hDir, vDir)){
			return true; 
		}
		if( this.getPts()[listPos] == color ) {
			if (checked[listPos]) {
				return this.checkSurrInDir(listPos, vDir, hDir, color, checked);
			} else {
				return this.checkSurr(listPos, color, checked) &&  this.checkSurrInDir(listPos, vDir, hDir, color, checked);
			}
		}
		else if( this.getPts()[listPos] === null) {
			return false;
		}
		else {

			return true;
		}
	}

    /*
    * HELPER METHOD FOR checkSurrInDir 
    * Because we represent our board as a 1-d array of points, it is hard to 
    * represent when something is off the board to the right or left.
    * This helper method determines if a vertical or horizontal move to the left or right or up or down is off the board
    */
    offBoard(loc, hDir, vDir){
        if( ((loc + hDir) < 0) || ((loc + hDir) > this.getPts().length - 1) ) {
            // index out of bounds protection
            return true;
        }
        else if( ((loc + (vDir * this.cols)) < 0) || ((loc + (vDir * this.cols)) > this.getPts().length - 1) ) {
            // index out of bounds protection
            return true;
        }
        else if( (hDir < 0) && (loc % this.cols == 0) ) { 
    
            // case where loc is in first column and trying to move horizontally to the left
            return true;
        }
        else if( (hDir > 0) && (loc % this.cols == this.cols -1) ) { 
            // case where loc is in the last column and trying to move horizontally to the right
            return true;
        }
    
        return false;
    }

    /* color is the "my" color, so checking if surrounding by the other color, or edges of the board */
	initCheckSurr(loc, color) {
        let check = new Array(this.cols * this.rows).fill(false);
		return this.checkSurr(loc, color, check);
	}
    
    /* color is the "my" color, so checking if surrounding by the other color, or edges of the board 
	 *  checked will be a list of flags of `loc`s that have already had `checkSurr` called on them.
	 */
	checkSurr(loc, color, checked) { 
		checked[loc] = true; 
		return  this.checkSurrInDir(loc, 1, 0, color, checked) && 
			    this.checkSurrInDir(loc, -1, 0, color, checked) &&
				this.checkSurrInDir(loc, 0, 1, color, checked) &&
				this.checkSurrInDir(loc, 0, -1, color, checked); 

	}

    checkAllSurr(color){ 
		const s = new Array(this.cols * this.rows).fill(false); 
		for(let i = 0; i < this.getPts().length; i++) {
			if(this.initCheckSurr(i, color) && this.getPts()[i] == color) {
				s[i] = true; 
			}
		}
		return s; 
	}

    getColor(){
        return this.player; 
    }

    getOppColor() {
		if(this.getColor() == 0) {
			return 1; 
		}
		else if(this.getColor() == 1) {
			return 0; 
		}
		
		return null; 
	}

    isSuicide(logCol, logRow) {
		return this.initCheckSurr(this.getLoc(logRow, logCol), this.getColor()); 
	}

	updateScore(){
		if(this.player == 0){
			this.blackScore++;
		}
		else{
			this.whiteScore++; 
		}
	}
    
}
