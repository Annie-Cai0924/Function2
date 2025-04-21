// Main JavaScript file
//I first define a variable, selectedEmotion, which is used to store "which emotion the user has currently selected". 
//At first, we don't know what the user has selected, so we set it to null, which means "not selected yet."
// Global variables
let selectedEmotion = null;
//I defined a variable called moodEntries to hold the "previously saved mood record". 
//It loads the data by calling a function loadMoodEntries()
let moodEntries = loadMoodEntries();
let currentPage = 'mood-page';

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // Check if on mobile
    if (window.innerWidth <= 480) {
        document.body.classList.add('mobile-view');
    }
});
//This is the "launch entry" function for our entire program
function initApp() {
    // Generate emotion buttons
    //get those emotional buttons out first
    generateEmotionButtons();
    
    // Set up event listeners
    //When the user clicks the 'record emotion' button, we execute the logMoodEntry function
    document.getElementById('log-emotion').addEventListener('click', logMoodEntry);
    //Add page navigation
    setupNavigation();
    // Render stars
    //It generates maps of stars and constellations based on the user's recorded emotions in the past
    renderStarChart();
    
    // Display history
    renderMoodHistory();
    //Generate emotional insights
    generateMoodInsights();
    //Generate emotional trends
    generateMoodTrends();
    // Add resize listener
    //When the user resizes the browser window, we resize the page layout
    window.addEventListener('resize', handleResize);
        // Initialize background animation
        initAnimation();
    
}

// Modify here: Set the page navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Obtain the ID of the target page
            const targetPage = link.dataset.page;
            
            switchPage(targetPage);
            
            // If switch to the star map page, re-render the star map
            if (targetPage === 'star-page') {
                renderStarChart();
            }
            
            // If switch to the feedback page, regenerate the emotional insights
            if (targetPage === 'feedback-page') {
                generateMoodInsights();
                generateMoodTrends();
            }
        });
    });
}

// Switch page function
function switchPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Display the target page
    document.getElementById(pageId).classList.add('active');
    
    // Update the navigation activation status
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Update the variables of the current page
    currentPage = pageId;
}


//https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
//https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
//This is a function called "Generate emotion button". What it does: It turns every emotion into a clickable button on a web page
function generateEmotionButtons() {
    const emotionsContainer = document.getElementById('primary-emotions');
    emotionsContainer.innerHTML = ''; // Clear existing buttons
    
    emotions.forEach(emotion => {
        const button = document.createElement('button');
        button.className = `mood-button mood-${emotion.id}`;
        //Save what emotion it represents on the button
        button.dataset.emotion = emotion.id;
        
        // Mobile style
        const isMobile = window.innerWidth <= 480;
        //For mobile phones, i gave the buttons a more compact style (to bring the emoji closer to the text). If it's a computer, use the normal layout.
        if (isMobile) {
            button.innerHTML = `<span>${emotion.emoji}</span>${emotion.name}`;
        } else {
            button.innerHTML = `${emotion.emoji} ${emotion.name}`;
        }
        //Every button has to listen for "being clicked." This function is executed when the user clicks on it
        button.addEventListener('click', () => {
            // Remove selected class from all buttons
            document.querySelectorAll('.mood-button').forEach(btn => {
                //Remove the.selected style class and return the button to its unselected state
                btn.classList.remove('selected');
            });
            
            // Add selected class
            button.classList.add('selected');
            
            // Update selected emotion
            selectedEmotion = emotion;
        });
        
        emotionsContainer.appendChild(button);
    });
}


//https://developer.mozilla.org/zh-CN/
//The "logMoodEntry" function, that is the "record mood" operation. This function is executed when the user clicks the "Record" button
function logMoodEntry() {
    // Validate input
    //This is a lockdown check. If the user hasn't selected any emotions yet, an alert box is displayed to remind them that they must select one first. Then simply return to stop the function execution
    if (!selectedEmotion) {
        alert('Please select an emotion first.');
        return;
    }
    
    // Get intensity
    const intensity = parseInt(document.getElementById('intensity-input').value);
    
    // Create new entry
    //I call another function, createMoodEntry, to generate a complete "mood log" of data with the emotion and intensity that I just selected
    const newEntry = createMoodEntry(selectedEmotion, intensity);
    
    // Add to entries array
    //Add the sentiment record you just created to the global variable moodEntries
    moodEntries.push(newEntry);
    
    // Save to local storage
    //Save updated moodEntries to your browser's localStorage so that you can refresh the page or come back next time without losing the data
    saveMoodEntries(moodEntries);
    
    // Update the "star map" and "history" on the page - that is, once the data has changed, visually re-render it, otherwise the user can't see what was just recorded
    renderStarChart();
    renderMoodHistory();

    //Update emotional insights
    generateMoodInsights();
    // Reset form
    //Clear the form and prepare for the next record. For example, empty the intensity input box and uncheck the selected emotion
    resetForm();
    
    // Show feedback
    //Give the user a feedback that tells them "The record was successful!
    showFeedback('Mood logged successfully!');

    //Automatically switch to the star map page
    setTimeout(() => {
        switchPage('star-page');
        }, 1000);
}


//https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
//This is a function called resetForm, which means reset the form.
//It runs after recording one emotion at a time, restoring the state and interface to their original state
function resetForm() {
    // Reset selected emotion
    //Clearing the user's previously selected emotions set to null is like removing all options and preparing for the next selection
    selectedEmotion = null;
    
    // Remove selected class from all buttons
    document.querySelectorAll('.mood-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Reset intensity slider
    document.getElementById('intensity-input').value = 5;
}

//https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
//https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
//The goal of this function is to give the user instant feedback, let the user know that their action was successful or failed, and automatically disappear after 3 seconds
function showFeedback(message) {
    // Create feedback element
    //Create a new div element to display the feedback message
    const feedback = document.createElement('div');
    //stylr for the feedback pop window
    feedback.textContent = message;
    feedback.style.position = 'fixed';
    feedback.style.top = '20px';
    feedback.style.left = '50%';
    feedback.style.transform = 'translateX(-50%)';
    feedback.style.padding = '10px 20px';
    feedback.style.color = 'white';
    feedback.style.backgroundColor = 'rgba(52, 152, 219, 0.8)';
    feedback.style.borderRadius = '5px';
    feedback.style.zIndex = '1000';
    
    // Add to page
    document.body.appendChild(feedback);
    
    // Remove after 3 seconds
    setTimeout(() => {
        document.body.removeChild(feedback);
    }, 3000);
}
//Re-implement the star map rendering and place the stars in chronological order
function renderStarChart() {
    const starsContainer = document.getElementById('stars-container');
    
    // Clear existing stars
    starsContainer.innerHTML = '';
    
    // Create background stars
    createBackgroundStars(starsContainer);
    
    //Sort the emotional records in chronological order
    const sortedEntries = [...moodEntries].sort((a, b) => a.timestamp - b.timestamp);

    // Create stars for each entry
    sortedEntries.forEach((entry, index) => {
        // the location is base on the time oder
        const position = calculateStarPosition(index, sortedEntries.length);
        createMoodStar(entry, starsContainer, position, index, sortedEntries.length);
    });
}

//This function is to calculated the stars' location
function calculateStarPosition(index, total) {
    if (total <= 1) {
        return { left: 50, top: 50 }; // center
    }
    
    //Calculate the position of the stars on the timeline (within the range of 0 to 1)
    const timePosition = index / (total - 1);
    
    // Generate the path point: An S-shaped path from the top left corner to the bottom right corner
    let left, top;
    
    if (timePosition < 0.25) {
        //Top left to top right (0-25%)
        left = 20 + (timePosition * 4) * 60;
        top = 20 + Math.sin(timePosition * Math.PI) * 10;
    } else if (timePosition < 0.5) {
        //  From top right to bottom right (25-50%)
        left = 80 - Math.sin((timePosition - 0.25) * Math.PI) * 10;
        top = 20 + ((timePosition - 0.25) * 4) * 60;
    } else if (timePosition < 0.75) {
        // From the bottom right to the bottom left (50-75%)
        left = 80 - ((timePosition - 0.5) * 4) * 60;
        top = 80 - Math.sin((timePosition - 0.5) * Math.PI) * 10;
    } else {
        // Lower left to the center (75-100%)
        left = 20 + Math.sin((timePosition - 0.75) * Math.PI) * 10;
        top = 80 - ((timePosition - 0.75) * 4) * 30;
    }
    
    // Add some random offsets to make the stars not completely aligned
    const randomOffsetX = Math.random() * 6 - 3;
    const randomOffsetY = Math.random() * 6 - 3;
    
    return { 
        left: left + randomOffsetX, 
        top: top + randomOffsetY
    };
}

function createBackgroundStars(container) {
    // Add simple background stars
    //Defines the number of stars in the background
    const numStars = 60; 
    
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star background-star';
        
        // Random position
        //left and top control the position of the stars on the page. Math.random() generates a random number between 0 and 1, which I multiply by 100, setting the position as a percentage of the width and height of the page, so that the positions of the stars are randomly distributed across the page
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Simple size
        //size Sets a random size for the star, from a minimum of 1px to a maximum of 3px. This makes each star appear to have a different size
        const size = Math.random() * 2 + 1; 
        
        // Opacity
        const opacity = Math.random() * 0.4 + 0.2; 
        
        // Random rotation
        //rotation Sets the Angle of rotation of a star. The range is -30 to 30 degrees. Make the stars appear to rotate at different angles
        const rotation = Math.random() * 60 - 30;
        
        // Apply styles
        //Here the previously calculated values are applied to the style of the star element. Use percentage positioning (left, top) and set the width, height, transparency, and rotation of the star
        star.style.left = `${left}%`;
        star.style.top = `${top}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.opacity = opacity;
        star.style.transform = `rotate(${rotation}deg)`;
        
        //The animationDuration is randomly generated and represents the duration of the flashing animation (between 5 and 13 seconds)
        // Simple twinkle animation
        //The animation property applies a twinkle animation with an animationDuration of seconds and an infinite loop
        const animationDuration = Math.random() * 8 + 5;
        star.style.animation = `twinkle ${animationDuration}s infinite`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(star);
    }
}

//This line of code creates a new div element that represents a star. We added the class star mood-star to it
//A record of a user's emotions and container is The container that holds all the stars
function createMoodStar(entry, container) {

    const star = document.createElement('div');
    star.className = 'star mood-star';
   // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style
    // Calculate position
    const totalDuration = Date.now() - (moodEntries.length > 0 ? moodEntries[0].timestamp : Date.now());
    const entryAge = Date.now() - entry.timestamp;
    const ageRatio = totalDuration > 0 ? entryAge / totalDuration : 0;
    
    // Add randomness
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    const randomOffsetX = Math.random() * 60 - 30; 
    const randomOffsetY = Math.random() * 60 - 30;
    
    const left = 10 + (80 * (1 - ageRatio)) + randomOffsetX;
    const top = 10 + (80 * ageRatio) + randomOffsetY;
    
    // Ensure within bounds
    const boundedLeft = Math.min(Math.max(left, 5), 95);
    const boundedTop = Math.min(Math.max(top, 5), 95);
    
    // Size based on intensity
    const isMobile = window.innerWidth <= 480;
    const sizeFactor = isMobile ? 0.8 : 1.2;
    const size = 4 + (entry.intensity * sizeFactor * 0.5);
    
    // Color based on emotion
    const color = entry.emotion.color;
    
    // Random rotation
    const rotation = Math.random() * 60 - 30;
    
    // Apply styles
    star.style.position = 'absolute';
    star.style.left = `${boundedLeft}%`;
    star.style.top = `${boundedTop}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.backgroundColor = color;
    star.style.transform = `rotate(${rotation}deg)`;
    
    // Add tooltip
    star.title = `${entry.emotion.name} (${entry.intensity}/10)`;
    
    container.appendChild(star);
}

//The main purpose of this code is to prepare for the next step -- to loop through recentEntries to display them on the page. You can go ahead and complete the following sections to actually create DOM elements to display these mood records
//Define a function, renderMoodHistory, to update the mood history area displayed on the page
function renderMoodHistory() {
    //Gets the container element used to display the emotional history in the HTML with the ID history-entries
    const historyContainer = document.getElementById('history-entries');
    
    // Clear existing entries
    //Empty the original contents of the container to avoid repeated additions. Each time history is refreshed, it is cleared first
    historyContainer.innerHTML = '';
    
    // Get recent entries
    const recentEntries = [...moodEntries]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5);
    
    // No entries message
    //When the user hasn't recorded any emotions yet, a prompt is displayed to encourage them to start
    if (recentEntries.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No mood entries yet. Start tracking your emotions!';
        message.style.textAlign = 'center';
        message.style.padding = '20px';
        historyContainer.appendChild(message);
        return;
    }
    
    // Create elements for each entry
    recentEntries.forEach((entry, index) => {
        const entryEl = document.createElement('div');
        entryEl.className = 'history-entry';
        entryEl.dataset.index = moodEntries.indexOf(entry);
        
        // Format date
        const date = new Date(entry.timestamp);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        
        entryEl.innerHTML = `
            <div class="entry-date">${formattedDate}</div>
            <div class="entry-mood">
                <div class="mood-indicator" style="background-color: ${entry.emotion.color}">${entry.emotion.emoji}</div>
                <div>${entry.emotion.name} (${entry.intensity}/10)</div>
            </div>
            <button class="delete-entry" title="Delete this entry">×</button>
        `;
        
        // Add delete button event
        const deleteButton = entryEl.querySelector('.delete-entry');
        deleteButton.addEventListener('click', () => {
            deleteEntry(entryEl.dataset.index);
        });
        
        historyContainer.appendChild(entryEl);
    });
}

// Delete entry
function deleteEntry(index) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this mood entry?')) {
        // Remove from array
        moodEntries.splice(index, 1);
        
        // Save to local storage
        saveMoodEntries(moodEntries);
        
        // Update UI
        renderStarChart();
        renderMoodHistory();
        
        // Show feedback
        showFeedback('Entry deleted successfully!');
    }
}

// Handle window resize
function handleResize() {
    const isMobile = window.innerWidth <= 480;
    const wasMobile = document.body.classList.contains('mobile-view');
    
    if (isMobile && !wasMobile) {
        document.body.classList.add('mobile-view');
        // Regenerate for mobile layout
        generateEmotionButtons();
        // Redraw stars
        renderStarChart();
    } else if (!isMobile && wasMobile) {
        document.body.classList.remove('mobile-view');
        // Regenerate for desktop layout
        generateEmotionButtons();
        // Redraw stars
        renderStarChart();
    }
}

//From https://codepen.io/micobytes/pen/aZjXxY
//I want to use this as my background because I like this style. I enjoy the animation following the mouse, which makes me feel as if I'm thinking, analyzing, and interacting with the user
// Use it as Background
(function() {
    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

    // Main
    //This code is writing a function called initAnimation, which means "initializing the animation", that is, some basic Settings needed to prepare the animation
    function initAnimation() {
        //Take the width of the browser window and store it in the variable "width"
        width = window.innerWidth;
        //This line is to bring the height of the browser window into "height"
        height = window.innerHeight;
        //to set a "target point" right in the middle of the screen, that is, at half the width and height
        target = {x: width/2, y: height/2};

        // find <canvas> on the web page and set its width and height properly
        canvas = document.getElementById('demo-canvas');
        //Set the size of this canvas to the width and height of the browser I just obtained
        canvas.width = width;
        canvas.height = height;
        //After obtaining the 2D drawing tool (context) on the canvas, we can use this ctx to draw lines, circles, text
        ctx = canvas.getContext('2d');

        // create points
        //Create an empty array called "points" specifically for holding these points
        points = [];
        //These two loops are designed to "lay a dot matrix" across the entire canvas, generating a dot at regular intervals
        for(var x = 0; x < width; x = x + width/20) {
            for(var y = 0; y < height; y = y + height/20) {
        //Add a little randomness to this point to prevent them from being too neat
                var px = x + Math.random()*width/20;
                var py = y + Math.random()*height/20;
         //Each point, in addition to its current x and y coordinates, also stores its "original position", which makes it convenient for the point to move around and return to its original position later
                var p = {x: px, originX: px, y: py, originY: py };
                //Put this point object into the points array for storage
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
        //Prepare an empty array closest for the current point p1. Later, it will be used to hold the five points closest to it
            var closest = [];
            var p1 = points[i];
        //Now take out all the other points and compare them one by one with p1
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
        //As long as it's not oneself, make the subsequent judgment
                if(!(p1 == p2)) {
        //There are a total of 5 points to be placed in closest. If the current KTH position is empty, first insert the current point p2
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
          //Check if any of these five "temporary nearest points" is farther from p1 than the current point p2
                    for(var k = 0; k < 5; k++) {
                        //If this p2 hasn't been put into closest yet, then let's see if we need to replace it with a farther point
                        if(!placed) {
                            //If the current point p2 is closer to p1 than closest[k], then update
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                //Substitute the closer point in
                                closest[k] = p2;
                        //Mark it. The position has been found. There's no need to keep changing
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        //Traverse every point
        for(var i in points) {
            //Create a new Circle using the constructor "circle". The radius is random between 2 and 4
            //The color is semi-transparent white 'rgba(255,255,255,0.3)', giving the stars a slightly soft feel
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }
        
        // Start animation
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
        
        // Add event listeners
        //If this device is not a touchscreen (for example, not a mobile phone or a tablet), then listen for mouse movement events
        if(!('ontouchstart' in window)) {
            //Listen for it as well when the page is scrolling
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        //When the window size changes (for example, when the user enlarges or reduces the window), readjust the canvas size
        window.addEventListener('resize', resize);
    }

    //This is to define a function named mouseMove, which will be called when the mouse moves
    function mouseMove(e) {
        //First, declare two variables, posx and posy, to store the current position of the mouse. The initial value is set to 0 first
        var posx = posy = 0;
        //Determine whether the browser supports pageX and pageY
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        //If pageX/Y is not supported, use clientX/Y plus the page scrolling distance
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

        //The function's role is to check if you have slid down the page. If you have slid too much, stop the animation
    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }
    //This function will be triggered when you "adjust the size of the browser window", with the aim of making the canvas size adapt to the new window size in real time
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    //This function is a "loop" that constantly refreshes the picture to create an animation effect
    function animate() {
        if(animateHeader) {
            //If we haven't slid too many pages before (the animateHeader is true), the animation continues
            ctx.clearRect(0,0,width,height);
            //Clear the entire canvas and draw new content for the next frame
            for(var i in points) {
            // detect points in range
             //If the mouse is very close to this point (less than 4000 away from it), then this point will "shine a little brighter". 
            //The closer it is, the brighter it gets; the farther it is, the darker it gets. Beyond a certain distance, it loses its brightness. "active" determines the transparency of the line, while "circle.active" determines the transparency of the circle
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }
                //Draw lines from the current point to its "nearest few points"
                drawLines(points[i]);
                //Draw a small circle of this point itself
                points[i].circle.draw();
            }
        }
        //Use the animation again
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        //Use TweenLite (an animation library) to make point p move over a period of time
        TweenLite.to(p, 1+1*Math.random(), 
        //The point will move to a random position that deviates from the original position by ±50 pixels. 
    //originX is the very beginning position of this point. 
    //In this way, the point won't run too far away and will just wander around the area where it is
        {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            //After the animation ends (the point floats to a new position), shiftPoint(p) is called again to continue moving
            onComplete: function() {
                shiftPoint(p);
            }});
    }
    //The "circular acceleration and deceleration" animation effect like Circ.easeInOut makes the movement process look more natural and gentle, unlike the stiffness of linear animation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(156,217,249,'+ p.active+')';
            ctx.stroke();
        }
    }

    //This function is used to create an object of a "Circle". Each point (point) will have a corresponding small circle (Circle), which can be drawn. Moreover, it becomes brighter when approaching the mouse and more transparent when moving away
    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            //It is a common way of writing, for the convenience of accessing the current circular object within the function
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();
        //A method of "drawing oneself" was defined for each Circle
        this.draw = function() {
            //If this circle is not in an active state now, don't draw it. Just skip it
            if(!_this.active) return;
            ctx.beginPath();
            //a complete circle
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            //Set the color of the circle. Here, light blue is used
            ctx.fillStyle = 'rgba(156,217,249,'+ _this.active+')';
            //Finally, fill this circle
            ctx.fill();
        };
    }

    // Util
    //This is to define a function named "getDistance", which means "obtain distance"
    function getDistance(p1, p2) {
    //In fact, it is to calculate the square of the distance using the Pythagorean theorem: 
 
    //The distance between two points 
    //= √((x1 - x2)² + (y1 - y2)²)
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
    
    // Make initAnimation function globally accessible
    window.initAnimation = initAnimation;
    
})();