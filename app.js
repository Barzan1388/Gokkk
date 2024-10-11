import React, { useState, useEffect } from 'react';
import { Brain, Home, Puzzle, Check, X } from 'lucide-react';

const App = () => {
const [isLoading, setIsLoading] = useState(true);
const [activeTab, setActiveTab] = useState('home');
const [crowTokens, setCrowTokens] = useState(() => {
    const saved = localStorage.getItem('crowTokens');
    return saved ? parseInt(saved, 10) : 0;
});
const [youtubeTimers, setYoutubeTimers] = useState(() => {
    const saved = localStorage.getItem('youtubeTimers');
    return saved ? JSON.parse(saved) : [
        { time: 600, started: false, completed: false, correct: null },
        { time: 600, started: false, completed: false, correct: null }
    ];
});
const [socialTimers, setSocialTimers] = useState(() => {
    const saved = localStorage.getItem('socialTimers');
    return saved ? JSON.parse(saved) : [
        { time: 240, started: false, completed: false },
        { time: 240, started: false, completed: false },
        { time: 360, started: false, completed: false }
    ];
});
const [riddleAnswer, setRiddleAnswer] = useState('');
const [riddleSubmitted, setRiddleSubmitted] = useState(() => {
    return localStorage.getItem('riddleSubmitted') === 'true';
});
const [riddleCorrect, setRiddleCorrect] = useState(() => {
    return localStorage.getItem('riddleCorrect') === 'true';
});
const [riddleLockTime, setRiddleLockTime] = useState(() => {
    const saved = localStorage.getItem('riddleLockTime');
    return saved ? parseInt(saved, 10) : null;
});
const [puzzleSelection, setPuzzleSelection] = useState([]);
const [puzzleSubmitted, setPuzzleSubmitted] = useState(() => {
    return localStorage.getItem('puzzleSubmitted') === 'true';
});
const [puzzleCorrect, setPuzzleCorrect] = useState(() => {
    return localStorage.getItem('puzzleCorrect') === 'true';
});
const [puzzleLockTime, setPuzzleLockTime] = useState(() => {
    const saved = localStorage.getItem('puzzleLockTime');
    return saved ? parseInt(saved, 10) : null;
});

useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 12000);

    return () => clearTimeout(timer);
}, []);

useEffect(() => {
    localStorage.setItem('crowTokens', crowTokens.toString());
    localStorage.setItem('youtubeTimers', JSON.stringify(youtubeTimers));
    localStorage.setItem('socialTimers', JSON.stringify(socialTimers));
    localStorage.setItem('riddleSubmitted', riddleSubmitted.toString());
    localStorage.setItem('riddleCorrect', riddleCorrect.toString());
    localStorage.setItem('riddleLockTime', riddleLockTime ? riddleLockTime.toString() : '');
    localStorage.setItem('puzzleSubmitted', puzzleSubmitted.toString());
    localStorage.setItem('puzzleCorrect', puzzleCorrect.toString());
    localStorage.setItem('puzzleLockTime', puzzleLockTime ? puzzleLockTime.toString() : '');
}, [crowTokens, youtubeTimers, socialTimers, riddleSubmitted, riddleCorrect, riddleLockTime, puzzleSubmitted, puzzleCorrect, puzzleLockTime]);

const handleYoutubeCheck = (index) => {
    if (!youtubeTimers[index].started) {
        alert("Redirecting to YouTube...");
        const newTimers = [...youtubeTimers];
        newTimers[index].started = true;
        setYoutubeTimers(newTimers);
        const timer = setInterval(() => {
            setYoutubeTimers(prev => {
                const newTimers = [...prev];
                newTimers[index].time -= 1;
                if (newTimers[index].time <= 0) {
                    clearInterval(timer);
                    newTimers[index].completed = true;
                }
                return newTimers;
            });
        }, 1000);
    }
};

const handleYoutubeCodeSubmit = (index) => {
    const code = prompt("Enter the code:");
    const newTimers = [...youtubeTimers];
    if (code === "YouTube") {
        setCrowTokens(prev => prev + 1000);
        newTimers[index].correct = true;
    } else {
        newTimers[index].correct = false;
    }
    setYoutubeTimers(newTimers);
};

const handleSocialCheck = (index) => {
    if (!socialTimers[index].started) {
        const platforms = ['Telegram', 'Twitter', 'YouTube'];
        alert(`Redirecting to ${platforms[index]}...`);
        const newTimers = [...socialTimers];
        newTimers[index].started = true;
        setSocialTimers(newTimers);
        const timer = setInterval(() => {
            setSocialTimers(prev => {
                const newTimers = [...prev];
                newTimers[index].time -= 1;
                if (newTimers[index].time <= 0) {
                    clearInterval(timer);
                    newTimers[index].completed = true;
                    const rewards = [400, 450, 600];
                    setCrowTokens(prev => prev + rewards[index]);
                }
                return newTimers;
            });
        }, 1000);
    }
};

const handleRiddleSubmit = () => {
    if (riddleAnswer.toLowerCase() === "satoshi nakamoto") {
        setCrowTokens(prev => prev + 150);
        setRiddleCorrect(true);
    } else {
        setRiddleLockTime(Date.now() + 24 * 60 * 60 * 1000);
    }
    setRiddleSubmitted(true);
};

const handlePuzzleSelect = (image) => {
    if (puzzleSelection.length < 4) {
        setPuzzleSelection(prev => [...prev, image]);
    }
};

const handlePuzzleSubmit = () => {
    if (puzzleSelection.join(',') === 'image1,image2,image3,image4') {
        setCrowTokens(prev => prev + 300);
        setPuzzleCorrect(true);
    } else {
        setPuzzleLockTime(Date.now() + 24 * 60 * 60 * 1000);
    }
    setPuzzleSubmitted(true);
};

if (isLoading) {
    return ( <
        div className = "flex items-center justify-center h-screen" >
        <
        div className = "w-16 h-16 border-4 border-black border-solid rounded-full animate-spin border-t-transparent" > < /div> < /
        div >
    );
}

return ( <
        div className = "flex flex-col min-h-screen" >
        <
        style jsx global > { `
        html, body {
          touch-action: pan-y;
        }
        button:focus, input:focus {
          outline: none;
        }
      ` } < /style> {
        activeTab === 'home' && ( <
            div className = "flex-grow p-4 overflow-y-auto" >
            <
            img src = "/api/placeholder/400/200"
            alt = "Header"
            className = "w-full h-40 object-cover mb-4" / >
            <
            div className = "text-center text-2xl mb-4" > Crow { crowTokens } < /div> <
            h2 className = "text-xl mb-2" > Video from our YouTube channel < /h2> {
            youtubeTimers.map((timer, index) => ( <
                    div key = { index }
                    className = "bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-4 mb-4" >
                    <
                    div className = "flex items-center justify-between" >
                    <
                    div className = "flex items-center" >
                    <
                    img src = "/api/placeholder/50/50"
                    alt = "Video thumbnail"
                    className = "w-12 h-12 mr-2" / >
                    <
                    div >
                    <
                    div > What Video < /div> <
                    div > 1000 + Crow < /div> < /
                    div > <
                    /div> {!timer.started ? ( <
                        button onClick = {
                            () => handleYoutubeCheck(index)
                        }
                        className = "bg-blue-500 text-white px-4 py-2 rounded" >
                        Check <
                        /button>
                    ) : timer.completed ? (
                        timer.correct === null ? ( <
                            button onClick = {
                                () => handleYoutubeCodeSubmit(index)
                            }
                            className = "bg-green-500 text-white px-4 py-2 rounded" >
                            Submit Code <
                            /button>
                        ) : timer.correct ? ( <
                            Check className = "text-green-500"
                            size = { 24 }
                            />
                        ) : ( <
                            X className = "text-red-500"
                            size = { 24 }
                            />
                        )
                    ) : ( <
                        div > { Math.floor(timer.time / 60) }: {
                            (timer.time % 60).toString().padStart(2, '0')
                        } < /div>
                    )
                } <
                /div> < /
                div >
            ))
    } <
    h2 className = "text-xl mb-2" > Following platforms < /h2> { ['Telegram', 'Twitter', 'YouTube'].map((platform, index) => ( <
            div key = { platform }
            className = "bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-4 mb-4" >
            <
            div className = "flex items-center justify-between" >
            <
            div className = "flex items-center" >
            <
            img src = "/api/placeholder/50/50"
            alt = { platform }
            className = "w-12 h-12 mr-2" / >
            <
            div >
            <
            div > Follow our { platform } < /div> <
            div > {
                [400, 450, 600][index]
            } + Crow < /div> < /
            div > <
            /div> {!socialTimers[index].started ? ( <
                button onClick = {
                    () => handleSocialCheck(index)
                }
                className = "bg-blue-500 text-white px-4 py-2 rounded" >
                Check <
                /button>
            ) : socialTimers[index].completed ? ( <
                Check className = "text-green-500"
                size = { 24 }
                />
            ) : ( <
                div > { Math.floor(socialTimers[index].time / 60) }: {
                    (socialTimers[index].time % 60).toString().padStart(2, '0')
                } < /div>
            )
        } <
        /div> < /
        div >
    ))
} <
/div>
)
}

{
    activeTab === 'riddle' && ( <
            div className = "flex-grow p-4" >
            <
            h2 className = "text-2xl mb-4" > Who was the creator of Bitcoin ? < /h2> <
            input type = "text"
            value = { riddleAnswer }
            onChange = {
                (e) => setRiddleAnswer(e.target.value)
            }
            className = { `w-full p-2 mb-4 rounded ${
              riddleSubmitted ? (riddleCorrect ? 'border-green-500' : 'border-red-500') : ''
            }` }
            disabled = { riddleSubmitted || (riddleLockTime && Date.now() < riddleLockTime) }
            /> <
            button onClick = { handleRiddleSubmit }
            className = "w-full bg-blue-500 text-white p-2 rounded"
            disabled = { riddleSubmitted || (riddleLockTime && Date.now() < riddleLockTime) } >
            Submit <
            /button> {
            riddleLockTime && Date.now() < riddleLockTime && ( <
                div className = "text-red-500 mt-2" > Try again in 24 hours < /div>
            )
        } <
        /div>
)
}

{
    activeTab === 'puzzle' && ( <
            div className = "flex-grow p-4" >
            <
            div className = { `flex mb-4 p-2 rounded ${
            puzzleSubmitted ? (puzzleCorrect ? 'border-green-500' : 'border-red-500') : ''
          }` } > {
                [0, 1, 2, 3].map((index) => ( <
                    div key = { index }
                    className = "w-1/4 h-20 border border-gray-300 mr-2" > {
                        puzzleSelection[index] && ( <
                            img src = "/api/placeholder/80/80"
                            alt = { `Selected ${index + 1}` }
                            className = "w-full h-full object-cover" / >
                        )
                    } <
                    /div>
                ))
            } <
            /div> <
            div className = "grid grid-cols-4 gap-2 mb-4" > {
                Array.from({ length: 12 }).map((_, index) => ( <
                    button key = { index }
                    onClick = {
                        () => handlePuzzleSelect(`image${index + 1}`)
                    }
                    className = "w-full h-20 bg-gray-200"
                    disabled = { puzzleSubmitted || puzzleSelection.length === 4 || (puzzleLockTime && Date.now() < puzzleLockTime) } >
                    <
                    img src = "/api/placeholder/80/80"
                    alt = { `Puzzle piece ${index + 1}` }
                    className = "w-full h-full object-cover" / >
                    <
                    /button>
                ))
            } <
            /div> <
            button onClick = { handlePuzzleSubmit }
            className = "w-full bg-blue-500 text-white p-2 rounded"
            disabled = { puzzleSelection.length !== 4 || puzzleSubmitted || (puzzleLockTime && Date.now() < puzzleLockTime) } >
            Submit <
            /button> {
            puzzleLockTime && Date.now() < puzzleLockTime && ( <
                div className = "text-red-500 mt-2" > Try again in 24 hours < /div>
            )
        } <
        /div>
)
}

<
div className = "fixed bottom-0 left-0 right-0 p-4" >
    <
    div className = "max-w-md mx-auto bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg" >
    <
    div className = "flex justify-between items-center p-4" >
    <
    button className = { `flex flex-col items-center ${activeTab === 'riddle' ? 'text-blue-500' : ''}` }
onClick = {
        () => setActiveTab('riddle')
    } >
    <
    Brain size = { 24 }
/> <
span > Riddle < /span> < /
    button > <
    button className = { `flex flex-col items-center ${activeTab === 'home' ? 'text-blue-500' : ''}` }
onClick = {
        () => setActiveTab('home')
    } >
    <
    Home size = { 24 }
/> <
span > Home < /span> < /
    button > <
    button className = { `flex flex-col items-center ${activeTab === 'puzzle' ? 'text-blue-500' : ''}` }
onClick = {
        () => setActiveTab('puzzle')
    } >
    <
    Puzzle size = { 24 }
/> <
span > Puzzle < /span> < /
    button > <
    /div> < /
    div > <
    /div> < /
    div >
);
};

export default App;