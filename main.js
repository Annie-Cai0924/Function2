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

      // Add additional scrolling listeners on the small screen
      enableMobileScrolling();
    }
    
    // Check the ultra-small screen
    if (window.innerWidth <= 375) {
        document.body.classList.add('small-mobile-view');
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

    window.scrollTo(0, 0);
}


//https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
//https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
//This is a function called "Generate emotion button". What it does: It turns every emotion into a clickable button on a web page
function generateEmotionButtons() {
    const emotionsContainer = document.getElementById('primary-emotions');
    emotionsContainer.innerHTML = ''; // Clear existing buttons
    
    // cbeck the screen size
    const isMobile = window.innerWidth <= 480;
    const isSmallMobile = window.innerWidth <= 375;

    emotions.forEach(emotion => {
        const button = document.createElement('button');
        button.className = `mood-button mood-${emotion.id}`;
        //Save what emotion it represents on the button
        button.dataset.emotion = emotion.id;

        // Make the buttons' color same as the emotion
        button.style.borderColor = emotion.color;
        button.style.borderWidth = '2px';
        button.style.backgroundColor = `${emotion.color}15`; 

        // Mobile style
        //For mobile phones, i gave the buttons a more compact style (to bring the emoji closer to the text). If it's a computer, use the normal layout.
        if (isSmallMobile) { 
            // mobile size
            button.innerHTML = `<span>${emotion.emoji}</span><span class="emotion-name">${emotion.name}</span>`;
            
            // mobile size style
            button.style.display = 'flex';
            button.style.flexDirection = 'column';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            button.style.padding = '8px 5px';
            
            const emojiSpan = button.querySelector('span:first-child');
            emojiSpan.style.fontSize = '1rem';
            emojiSpan.style.marginBottom = '2px';
            
            const nameSpan = button.querySelector('.emotion-name');
            nameSpan.style.fontSize = '0.8rem';
            nameSpan.style.color = emotion.color;
        }

            else if (isMobile) {
                // 一般移动设备
                button.innerHTML = `<span>${emotion.emoji}</span>${emotion.name}`;
                
                const emojiSpan = button.querySelector('span');
                emojiSpan.style.display = 'block';
                emojiSpan.style.marginBottom = '5px';
                button.style.color = emotion.color;
                
            } else {
            //site size
            button.innerHTML = `${emotion.emoji} ${emotion.name}`;
            button.style.color = emotion.color;
        }

        //Every button has to listen for "being clicked." This function is executed when the user clicks on it
        button.addEventListener('click', () => {
            // Remove selected class from all buttons
            document.querySelectorAll('.mood-button').forEach(btn => {
                //Remove the.selected style class and return the button to its unselected state
                btn.classList.remove('selected');

                const btnEmotionId = btn.dataset.emotion;
                const btnEmotion = emotions.find(e => e.id === btnEmotionId);
                if (btnEmotion) {
                    btn.style.backgroundColor = `${btnEmotion.color}15`;
                    btn.style.boxShadow = 'none';
                }
            });
            
            // Add selected class
            button.classList.add('selected');

            //buttons' color and Transparency
            button.style.backgroundColor = `${emotion.color}30`;  
            button.style.boxShadow = `0 0 15px ${emotion.color}80`; 
            
            // Update selected emotion
            selectedEmotion = emotion;
        });
            //animation about the mouse hover
            button.addEventListener('mouseover', () => {
                if (!button.classList.contains('selected')) {
                    button.style.backgroundColor = `${emotion.color}25`; 
                    button.style.boxShadow = `0 0 10px ${emotion.color}40`; 
                }
            });
            
            button.addEventListener('mouseout', () => {
                if (!button.classList.contains('selected')) {
                    button.style.backgroundColor = `${emotion.color}15`;
                    button.style.boxShadow = 'none'; 
                }
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

        // Make sure to scroll to the top on your mobile device
        if (window.innerWidth <= 480) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
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
    // Reduce the number of stars on the small screen to improve performance
    const isMobileSmall = window.innerWidth <= 375;
    const numStars = isMobileSmall ? 80 : 150;
    
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star background-star';
        
        // Random position
        //left and top control the position of the stars on the page. Math.random() generates a random number between 0 and 1, which I multiply by 100, setting the position as a percentage of the width and height of the page, so that the positions of the stars are randomly distributed across the page
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Simple size
        //size Sets a random size for the star, from a minimum of 1px to a maximum of 3px. This makes each star appear to have a different size
           // Variable size - Reduce it slightly on the small screen
           const size = isMobileSmall ? 
           (Math.random() * 1.5 + 1) : 
           (Math.random() * 3 + 1);
        
        // Opacity
        const opacity = Math.random() * 0.7 + 0.3; 
        
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
        const animationDuration = isMobileSmall ? 
        (Math.random() * 5 + 5) : 
        (Math.random() * 8 + 3);
    star.style.animation = `twinkle ${animationDuration}s infinite`;
    star.style.animationDelay = `${Math.random() * 5}s`;
        
         // add some lightly style and reduce on the mobile size
         const glowSize = isMobileSmall ? 
         (Math.random() * 3 + 1) : 
         (Math.random() * 5 + 2);
     star.style.boxShadow = `0 0 ${glowSize}px rgba(255, 255, 255, ${opacity})`;
     
     container.appendChild(star);
    }

        // add aome big stars and reduce the amount about the mobile's
        const numBigStars = isMobileSmall ? 8 : 15;
        for (let i = 0; i < numBigStars; i++) {
            const bigStar = document.createElement('div');
            bigStar.className = 'star background-star';
            
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const size = isMobileSmall ? 
                (Math.random() * 1.5 + 2) : 
                (Math.random() * 2 + 3);
            
            bigStar.style.left = `${left}%`;
            bigStar.style.top = `${top}%`;
            bigStar.style.width = `${size}px`;
            bigStar.style.height = `${size}px`;
            bigStar.style.opacity = 0.9;
            
            // adjust the size of light
            const glowSize = isMobileSmall ? size * 2 : size * 3;
            bigStar.style.boxShadow = `0 0 ${glowSize}px rgba(255, 255, 255, 0.8)`;
            
            const animationDuration = Math.random() * 5 + 5;
            bigStar.style.animation = `twinkle ${animationDuration}s infinite`;
            
            container.appendChild(bigStar);
 
    }
}

//This line of code creates a new div element that represents a star. We added the class star mood-star to it
//A record of a user's emotions and container is The container that holds all the stars
function createMoodStar(entry, container, position, index, total) {
    const star = document.createElement('div');
    star.className = 'star mood-star';
    
    // Use the calculated position
    const left = position.left;
    const top = position.top;

// Size adjustment based on strength and screen size
const isMobile = window.innerWidth <= 480;
const isSmallMobile = window.innerWidth <= 375;

// Use a more appropriate size factor on small screens
let sizeFactor = 1.5; // the site size
if (isSmallMobile) {
    sizeFactor = 0.8; // optimize the mobile size 
} else if (isMobile) {
    sizeFactor = 1.0; // mobile size
}

const size = 6 + (entry.intensity * sizeFactor * 0.6);

// Color based on emotion
const color = entry.emotion.color;

// Calculate the brightness of the stars based on the time
const brightness = 1.0; // the most bright

// Random rotation Angle
const rotation = Math.random() * 60 - 30;
    
    // Apply styles
    star.style.position = 'absolute';
    star.style.left = `${left}%`;
    star.style.top = `${top}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.backgroundColor = color;
    star.style.opacity = brightness;
   
     // Add a halo effect and reduce it appropriately on a small screen
     const glowSize = isSmallMobile ? size * 0.8 : size;
     star.style.boxShadow = `0 0 ${glowSize}px ${color}, 0 0 ${glowSize * 1.3}px rgba(255, 255, 255, 0.8)`;
     star.style.transform = `rotate(${rotation}deg)`;
     
     // Add the flickering animation
     const animationDuration = 3 + Math.random() * 4;
     star.style.animation = `twinkle ${animationDuration}s infinite`;
     
     // Add tooltip
     star.title = `${entry.emotion.name} (${entry.intensity}/10) - ${new Date(entry.timestamp).toLocaleString()}`;
 
     // Add click event to show details
     star.addEventListener('click', () => {
        showMoodDetails(entry);
    });

    container.appendChild(star);
}

// Show emotional details
function showMoodDetails(entry) {
    const date = new Date(entry.timestamp);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    //Create a floating layer to display the details
    //Add content to the pop-up window
    const detailsPopup = document.createElement('div');
    detailsPopup.className = 'mood-details-popup';
    //Display emojis, emotion names, and close buttons
    //Display the date and strength bar
    detailsPopup.innerHTML = `
        <div class="mood-details-content">
            <div class="details-header" style="background-color: ${entry.emotion.color}20;">
                <span class="details-emoji">${entry.emotion.emoji}</span>
                <h3>${entry.emotion.name}</h3>
                <span class="close-details">×</span>
            </div>
            <div class="details-body">
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Intensity:</strong> 
                    <span class="intensity-bar" style="width: ${entry.intensity * 10}%; background-color: ${entry.emotion.color};"></span>
                    <span class="intensity-text">${entry.intensity}/10</span>
                </p>
            </div>
        </div>
    `;
     // Add the close button
     //Add the created pop-up window to the entire web page to make it appear on the page.
     document.body.appendChild(detailsPopup);

    //Add style
    //Set the style of the pop-up mask
    detailsPopup.style.position = 'fixed';
    detailsPopup.style.top = '0';
    detailsPopup.style.left = '0';
    detailsPopup.style.width = '100%';
    detailsPopup.style.height = '100%';
    detailsPopup.style.backgroundColor = 'rgba(0,0,0,0.7)';
    detailsPopup.style.display = 'flex';
    detailsPopup.style.justifyContent = 'center';
    detailsPopup.style.alignItems = 'center';
    detailsPopup.style.zIndex = '100';
    detailsPopup.style.opacity = '0';
    detailsPopup.style.transition = 'opacity 0.3s ease';
    
    //Determine whether the current screen is less than or equal to 375px. If it is, set the width to 90% (relative width); otherwise, set it to 300px (fixed width)
    const content = detailsPopup.querySelector('.mood-details-content');
      const isMobileSmall = window.innerWidth <= 375;
      content.style.width = isMobileSmall ? '90%' : '300px';
      
      //Set the card content style: background, rounded corners, shadow, and initial downward shift of 20px for animation
      content.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
      content.style.borderRadius = isMobileSmall ? '12px' : '15px';
      content.style.overflow = 'hidden';
      content.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
      content.style.transform = 'translateY(20px)';
      content.style.transition = 'transform 0.3s ease';
      
      //Beautify the top title section, center the layout, add a lower border, and get the emoji and close button ready
      //Emojis are more eye-catching. Use different font sizes on different devices
      const header = content.querySelector('.details-header');
      header.style.padding = isMobileSmall ? '15px' : '20px';
      header.style.textAlign = 'center';
      header.style.position = 'relative';
      header.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
      
      const emoji = content.querySelector('.details-emoji');
      emoji.style.fontSize = isMobileSmall ? '32px' : '40px';
      emoji.style.display = 'block';
      emoji.style.marginBottom = isMobileSmall ? '5px' : '10px';
      
      //Set the font size and spacing of the emotion name
      const title = content.querySelector('h3');
      title.style.fontSize = isMobileSmall ? '1.2rem' : '1.5rem';
      title.style.margin = '0';
      //The "×" close button in the upper right corner has a hover effect
      const closeBtn = content.querySelector('.close-details');
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '10px';
      closeBtn.style.right = '15px';
      closeBtn.style.fontSize = '24px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.opacity = '0.7';
      closeBtn.style.transition = 'opacity 0.2s';
      
      const body = content.querySelector('.details-body');
      body.style.padding = isMobileSmall ? '15px' : '20px';
      body.style.fontSize = isMobileSmall ? '0.9rem' : '1rem';
      
      //Make the strength bar look like a colorful progress bar
      const intensityBar = content.querySelector('.intensity-bar');
      intensityBar.style.height = '8px';
      intensityBar.style.display = 'inline-block';
      intensityBar.style.borderRadius = '4px';
      intensityBar.style.marginRight = '10px';

      // Trigger with setTimeout after a 10-millisecond delay to make the pop-up window gradually appear and have an ascending animation
    setTimeout(() => {
        detailsPopup.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    }, 10);
    
    // When the mouse moves over the close button, increase the transparency to prompt the user that it is clickable
    closeBtn.addEventListener('mouseover', () => {
        closeBtn.style.opacity = '1';
    });
    
    closeBtn.addEventListener('mouseout', () => {
        closeBtn.style.opacity = '0.7';
    });
    
    //Turn off the animation: The pop-up window fades, the content slides down, and then remove the element from the page
    const closePopup = () => {
        detailsPopup.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(detailsPopup);
        }, 300);
    };
    
    //Close when the "×" button is clicked. It is also closed when the black background area is clicked
    closeBtn.addEventListener('click', closePopup);
    detailsPopup.addEventListener('click', (e) => {
        if (e.target === detailsPopup) {
            closePopup();
        }
    });
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
        generateMoodInsights();
        generateMoodTrends();
        
        // Show feedback
        showFeedback('Entry deleted successfully!');
    }
}

// Generate emotional insights
function generateMoodInsights() {
    const insightsContainer = document.getElementById('mood-insights');
    
    // Clear the existing content
    insightsContainer.innerHTML = '';
    
    // If there are not enough records, display the default message
    if (moodEntries.length < 3) {
        insightsContainer.innerHTML = '<p class="no-insights">Track your emotions regularly to receive personalized insights.</p>';
        return;
    }
    
    // Obtain the records of the last 7 days
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentEntries = moodEntries.filter(entry => entry.timestamp > oneWeekAgo);
    
    // Create emotional insights
    const insights = [];
    
    // Check for the same emotions for three consecutive days
    const checkConsecutiveEmotions = () => {
        const sortedEntries = [...recentEntries].sort((a, b) => a.timestamp - b.timestamp);
        
        const emotionCounts = {};
        let consecutiveDays = 1;
        let lastEmotionId = null;
        let lastDate = null;
        
        for (const entry of sortedEntries) {
            const entryDate = new Date(entry.timestamp).toDateString();
            
            // If there are multiple records on the same day, skip them
            if (entryDate === lastDate) {
                continue;
            }
            
            // Check if the mood is the same as the previous day
            if (entry.emotion.id === lastEmotionId) {
                consecutiveDays++;
                
                // Achieve three consecutive days
                if (consecutiveDays >= 3) {
                    // Create different feedbacks based on emotion types
                    if (['sadness', 'anger', 'fear'].includes(entry.emotion.id)) {
                        insights.push({
                            title: `You've been feeling ${entry.emotion.name} for ${consecutiveDays} days`,
                            message: `It's important to acknowledge your ${entry.emotion.name}. Consider talking to someone you trust or try activities that usually make you feel better.`,
                            type: 'warning',
                            emotion: entry.emotion
                        });
                    } else if (entry.emotion.id === 'joy') {
                        insights.push({
                            title: `${consecutiveDays} days of happiness!`,
                            message: `That's wonderful! You've been experiencing Joy for ${consecutiveDays} consecutive days. Keep doing what makes you happy!`,
                            type: 'positive',
                            emotion: entry.emotion
                        });
                    }
                    
                    // Report consecutive emotions only once
                    break;
                }
            } else {
                consecutiveDays = 1;
            }
            
            lastEmotionId = entry.emotion.id;
            lastDate = entryDate;
        }
    };
    
    // Check the changes in emotional intensity
    const checkIntensityTrends = () => {
        if (recentEntries.length < 4) return;
        
        // base on time
        const sortedEntries = [...recentEntries].sort((a, b) => a.timestamp - b.timestamp);
        
        // Calculate the average intensity
        let sumIntensity = 0;
        sortedEntries.forEach(entry => {
            sumIntensity += entry.intensity;
        });
        const avgIntensity = sumIntensity / sortedEntries.length;
        
        // Check whether the recent intensity is significantly higher than the average
        const recentIntensities = sortedEntries.slice(-3).map(entry => entry.intensity);
        const recentAvg = recentIntensities.reduce((a, b) => a + b, 0) / recentIntensities.length;
        
        if (recentAvg > avgIntensity + 2) {
            insights.push({
                title: "Your emotional intensity is increasing",
                message: "You've been experiencing emotions more intensely lately. This could be a response to recent events. Take some time for self-care and reflection.",
                type: 'neutral'
            });
        } else if (recentAvg < avgIntensity - 2 && avgIntensity > 5) {
            insights.push({
                title: "Your emotional intensity is decreasing",
                message: "Your emotions have been less intense recently. This could be a sign of emotional balance or possibly emotional numbness. Check in with yourself.",
                type: 'neutral'
            });
        }
    };
    
    // Execution insight analysis
    checkConsecutiveEmotions();
    checkIntensityTrends();
    
    // Show the insight results
    if (insights.length === 0) {
        // If there is no specific insight, show general information
        insightsContainer.innerHTML = `
            <div class="insight-item">
                <h4>Your emotional journey looks balanced</h4>
                <p>Keep tracking your emotions to receive more personalized insights.</p>
            </div>
        `;
    } else {
        // Show all insights
        insights.forEach(insight => {
            const insightEl = document.createElement('div');
            insightEl.className = `insight-item ${insight.type}`;
            
            insightEl.innerHTML = `
                <h4>${insight.title}</h4>
                <p>${insight.message}</p>
            `;
            
            insightsContainer.appendChild(insightEl);
        });
    }
}
//Generate emotional trends此处修改：生成情绪趋势
function generateMoodTrends() {
    const trendsContainer = document.getElementById('trends-container');
    
    // Clear the existing content
    trendsContainer.innerHTML = '';
    
    // If there are not enough records, display the default message
    if (moodEntries.length < 3) {
        trendsContainer.innerHTML = '<p class="no-insights">More data needed to generate trends.</p>';
        return;
    }
    
    // Calculate the occurrence frequency of each emotion
    const emotionCounts = {};
    emotions.forEach(emotion => {
        emotionCounts[emotion.id] = 0;
    });
    
    moodEntries.forEach(entry => {
        emotionCounts[entry.emotion.id]++;
    });
    
    // Create a trend chart
    const chartEl = document.createElement('div');
    chartEl.className = 'trend-chart';
    
    // Find the highest count for calculating the proportion
    const maxCount = Math.max(...Object.values(emotionCounts));
    
    // Create a bar chart for each emotion
    emotions.forEach(emotion => {
        if (emotionCounts[emotion.id] > 0) {
            const barHeight = (emotionCounts[emotion.id] / maxCount) * 100;
            
            const barEl = document.createElement('div');
            barEl.className = 'trend-bar';
            barEl.style.height = `${barHeight}%`;
            barEl.style.backgroundColor = emotion.color;
            barEl.setAttribute('data-emotion', emotion.name);
            barEl.title = `${emotion.name}: ${emotionCounts[emotion.id]} entries`;
            
            chartEl.appendChild(barEl);
        }
    });
    
    trendsContainer.appendChild(chartEl);
}

// Handle window resize
function handleResize() {
    const isMobile = window.innerWidth <= 480;
    const wasMobile = document.body.classList.contains('mobile-view');
    const isSmallMobile = window.innerWidth <= 375;
    const wasSmallMobile = document.body.classList.contains('small-mobile-view');

    if (isMobile && !wasMobile) {
        document.body.classList.add('mobile-view');
        // Regenerate for mobile layout
        generateEmotionButtons();
        renderStarChart();
        enableMobileScrolling();
        // Redraw stars
        renderStarChart();
    } else if (!isMobile && wasMobile) {
        document.body.classList.remove('mobile-view');
        // Regenerate for desktop layout
        generateEmotionButtons();
        // Redraw stars
        renderStarChart();
    }
        //mobile size style
        if (isSmallMobile && !wasSmallMobile) {
            document.body.classList.add('small-mobile-view');
            generateEmotionButtons();
            renderStarChart();
            document.querySelectorAll('.page').forEach(page => {
                page.style.paddingBottom = '50px';
            });
        } else if (!isSmallMobile && wasSmallMobile) {
            document.body.classList.remove('small-mobile-view');
            generateEmotionButtons();
            renderStarChart();
            document.querySelectorAll('.page').forEach(page => {
                page.style.paddingBottom = '20px';
            });
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

// Add scrolling function to the mobile size
function enableMobileScrolling() {
    document.body.style.height = 'auto';
    document.body.style.overflowY = 'auto';
    
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.overflowY = 'auto';
        page.style.WebkitOverflowScrolling = 'touch';
        page.addEventListener('touchstart', function(e) {
        }, { passive: true }); 
    });
    const historyList = document.getElementById('history-entries');
    if (historyList) {
        historyList.style.overflowY = 'auto';
        historyList.style.WebkitOverflowScrolling = 'touch';
    }
    const allButtons = document.querySelectorAll('button, .nav-link, .mood-button, .delete-entry');
    allButtons.forEach(button => {
        button.style.minHeight = '44px';
    });
}