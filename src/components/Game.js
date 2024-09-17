import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { auth, firestore } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/Game.css';

const Game = () => {
  const [game, setGame] = useState(new Chess());
  const [user, setUser] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [message, setMessage] = useState('');
  const [boardColors, setBoardColors] = useState({
    light: '#ffffff',
    dark: '#000000'
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSquareClick = (square) => {
    const piece = game.get(square);
    
    if (selectedPiece === square) {
      setSelectedPiece(null);
      setPossibleMoves([]);
    } else if (piece && piece.color === game.turn()) {
      setSelectedPiece(square);
      const moves = game.moves({ square: square, verbose: true });
      setPossibleMoves(moves.map(move => move.to));
    } else if (selectedPiece) {
      try {
        const move = game.move({
          from: selectedPiece,
          to: square,
          promotion: 'q'
        });
        
        if (move) {
          setGame(new Chess(game.fen()));
          setSelectedPiece(null);
          setPossibleMoves([]);
          saveGameState();
        }
      } catch (error) {
        setMessage("Invalid move");
        setTimeout(() => setMessage(''), 2000);
      }
    }
  };

  const saveGameState = async () => {
    if (user) {
      try {
        await setDoc(doc(firestore, 'games', user.uid), {
          fen: game.fen(),
          lastUpdated: new Date()
        });
      } catch (error) {
        console.error('Error saving game state:', error);
      }
    }
  };

  const getPieceImage = (piece) => {
    if (!piece) return null;
    const color = piece.color === 'w' ? 'white' : 'black';
    const pieceType = {
      'p': 'pawn',
      'n': 'knight',
      'b': 'bishop',
      'r': 'rook',
      'q': 'queen',
      'k': 'king'
    }[piece.type];
    return `/assets/${color}_${pieceType}.svg`;
  };

  const renderBoard = () => {
    const board = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    
    board.push(
      <div key="file-labels" className="file-labels">
        {files.map(file => <div key={file}>{file}</div>)}
      </div>
    );

    for (let i = 7; i >= 0; i--) {
      const row = [];
      
      row.push(<div key={`rank-${i+1}`} className="rank-label">{i+1}</div>);
      
      for (let j = 0; j < 8; j++) {
        const square = String.fromCharCode(97 + j) + (i + 1);
        const piece = game.get(square);
        const isSelected = selectedPiece === square;
        const isPossibleMove = possibleMoves.includes(square);
        const squareColor = (i + j) % 2 === 0 ? boardColors.light : boardColors.dark;
        row.push(
          <div
            key={square}
            className={`square ${isSelected ? 'selected' : ''} ${isPossibleMove ? 'possible-move' : ''}`}
            style={{ backgroundColor: squareColor }}
            onClick={() => handleSquareClick(square)}
          >
            {piece && <img src={getPieceImage(piece)} alt={piece.type} className="chess-piece" />}
          </div>
        );
      }
      board.push(<div key={`row-${i}`} className="board-row">{row}</div>);
    }
    return board;
  };

  const changeColors = (lightColor, darkColor) => {
    setBoardColors({ light: lightColor, dark: darkColor });
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="game">
      <div className="logo-text">Chess Battle</div>
      {user && (
        <div className="user-info" onClick={toggleDropdown}>
          {user.displayName || user.email}
          {dropdownVisible && (
            <div className="dropdown">
              <button onClick={handleLogout} className="dropdown-button">Logout</button>
            </div>
          )}
        </div>
      )}
      <div className="game-container">
        <div className="chessboard-container">
          <div className="chessboard">
            {renderBoard()}
          </div>
        </div>
        {message && <div className="message">{message}</div>}
        <div className="color-options">
          <button onClick={() => changeColors('#ffffff', '#000000')}>Default (Black & White)</button>
          <button onClick={() => changeColors('#f0d9b5', '#b58863')}>Wooden Theme</button>
          <button onClick={() => changeColors('#add8e6', '#4682b4')}>Blue Theme</button>
          <button onClick={() => changeColors('#90EE90', '#228B22')}>Green Theme</button>
        </div>
      </div>
    </div>
  );
};

export default Game;