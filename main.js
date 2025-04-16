// Main JavaScript file
//I first define a variable, selectedEmotion, which is used to store "which emotion the user has currently selected". 
//At first, we don't know what the user has selected, so we set it to null, which means "not selected yet."
// Global variables
let selectedEmotion = null;
//I defined a variable called moodEntries to hold the "previously saved mood record". 
//It loads the data by calling a function loadMoodEntries()
let moodEntries = loadMoodEntries();

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
    
    // Render stars
    //It generates maps of stars and constellations based on the user's recorded emotions in the past
    renderStarChart();
    
    // Display history
    renderMoodHistory();
    
    // Add resize listener
    //When the user resizes the browser window, we resize the page layout
    window.addEventListener('resize', handleResize);
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
    
    // Reset form
    //Clear the form and prepare for the next record. For example, empty the intensity input box and uncheck the selected emotion
    resetForm();
    
    // Show feedback
    //Give the user a feedback that tells them "The record was successful!
    showFeedback('Mood logged successfully!');
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
    feedback.style.borderRadius = '5px';
    feedback.style.zIndex = '1000';
    
    // Add to page
    document.body.appendChild(feedback);
    
    // Remove after 3 seconds
    setTimeout(() => {
        document.body.removeChild(feedback);
    }, 3000);
}

function renderStarChart() {
    const starsContainer = document.getElementById('stars-container');
    
    // Clear existing stars
    starsContainer.innerHTML = '';
    
    // Create background stars
    createBackgroundStars(starsContainer);
    
    // Create stars for each entry
    moodEntries.forEach(entry => {
        createMoodStar(entry, starsContainer);
    });
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