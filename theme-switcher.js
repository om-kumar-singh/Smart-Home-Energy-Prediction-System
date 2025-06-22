// Theme switcher for Energy Consumption Analyzer

document.addEventListener('DOMContentLoaded', function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    
    // Check if we have a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
    
    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', function() {
        // Get current theme
        const currentTheme = htmlEl.getAttribute('data-bs-theme');
        
        // Determine new theme
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply the new theme
        applyTheme(newTheme);
        
        // Save preference to localStorage
        localStorage.setItem('theme', newTheme);
    });
    
    // Apply theme and update UI
    function applyTheme(theme) {
        // Update HTML attribute
        htmlEl.setAttribute('data-bs-theme', theme);
        
        // Apply theme class to body
        document.body.classList.remove('theme-dark', 'theme-light');
        document.body.classList.add('theme-' + theme);
        
        // Update navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (theme === 'dark') {
                navbar.classList.remove('navbar-light', 'bg-light');
                navbar.classList.add('navbar-dark', 'bg-dark');
            } else {
                navbar.classList.remove('navbar-dark', 'bg-dark');
                navbar.classList.add('navbar-light', 'bg-light');
            }
        }
        
        // Update all cards with theme
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.classList.remove('bg-dark', 'bg-light');
            card.classList.remove('text-white', 'text-dark');
            
            if (theme === 'dark') {
                card.classList.add('bg-dark', 'text-white');
            } else {
                card.classList.add('bg-light', 'text-dark');
            }
        });
        
        // Update list groups with theme
        const listItems = document.querySelectorAll('.list-group-item');
        listItems.forEach(item => {
            if (theme === 'dark') {
                item.classList.add('bg-dark', 'text-white', 'border-secondary');
            } else {
                item.classList.remove('bg-dark', 'text-white', 'border-secondary');
            }
        });
        
        // Update button text and icon
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            themeToggleBtn.classList.remove('btn-outline-dark');
            themeToggleBtn.classList.add('btn-outline-light');
            
            // Update progress bars and other elements
            const progressBars = document.querySelectorAll('.progress');
            progressBars.forEach(pb => {
                pb.classList.add('bg-dark');
            });
            
            // Update footer
            const footer = document.querySelector('footer');
            if (footer) {
                footer.classList.remove('bg-light', 'text-dark');
                footer.classList.add('bg-dark', 'text-light');
            }
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            themeToggleBtn.classList.remove('btn-outline-light');
            themeToggleBtn.classList.add('btn-outline-dark');
            
            // Update progress bars and other elements
            const progressBars = document.querySelectorAll('.progress');
            progressBars.forEach(pb => {
                pb.classList.remove('bg-dark');
            });
            
            // Update footer
            const footer = document.querySelector('footer');
            if (footer) {
                footer.classList.remove('bg-dark', 'text-light');
                footer.classList.add('bg-light', 'text-dark');
            }
        }
        
        // Update about project section
        const aboutProject = document.querySelector('.about-project');
        if (aboutProject) {
            if (theme === 'dark') {
                aboutProject.style.backgroundColor = '#2c3039';
                aboutProject.style.color = 'rgba(255, 255, 255, 0.9)';
            } else {
                aboutProject.style.backgroundColor = '#f8f9fa';
                aboutProject.style.color = 'rgba(0, 0, 0, 0.9)';
            }
        }
        
        // Update any tooltips with new theme
        try {
            // Re-initialize tooltips with new theme
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        } catch (e) {
            console.log('Tooltip initialization error:', e);
        }
        
        // Update charts if they exist
        updateChartsForTheme(theme);
    }
    
    // Update chart colors based on theme
    function updateChartsForTheme(theme) {
        // Get all charts on the page
        if (window.consumptionChart) {
            updateChartColors(window.consumptionChart, theme);
        }
        
        if (window.predictionChart) {
            updateChartColors(window.predictionChart, theme);
        }
    }
    
    // Update specific chart's colors based on theme
    function updateChartColors(chart, theme) {
        // Update grid lines color
        const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        // Update text color
        const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
        const titleColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
        
        // Make sure the grid object exists
        if (!chart.options.scales.x.grid) chart.options.scales.x.grid = {};
        if (!chart.options.scales.y.grid) chart.options.scales.y.grid = {};
        
        chart.options.scales.x.grid.color = gridColor;
        chart.options.scales.y.grid.color = gridColor;
        
        // Make sure the ticks and title objects exist
        if (!chart.options.scales.x.ticks) chart.options.scales.x.ticks = {};
        if (!chart.options.scales.y.ticks) chart.options.scales.y.ticks = {};
        if (!chart.options.scales.x.title) chart.options.scales.x.title = {display: true, text: 'Time'};
        if (!chart.options.scales.y.title) chart.options.scales.y.title = {display: true, text: 'Energy Consumption (kWh)'};
        
        chart.options.scales.x.ticks.color = textColor;
        chart.options.scales.y.ticks.color = textColor;
        chart.options.scales.x.title.color = titleColor;
        chart.options.scales.y.title.color = titleColor;
        
        // Update tooltip colors
        if (!chart.options.plugins.tooltip) chart.options.plugins.tooltip = {};
        
        chart.options.plugins.tooltip.backgroundColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)';
        chart.options.plugins.tooltip.titleColor = theme === 'dark' ? 'white' : 'black';
        chart.options.plugins.tooltip.bodyColor = theme === 'dark' ? 'white' : 'black';
        chart.options.plugins.tooltip.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
        
        // Update legend colors
        if (chart.options.plugins && chart.options.plugins.legend) {
            chart.options.plugins.legend.labels = chart.options.plugins.legend.labels || {};
            chart.options.plugins.legend.labels.color = textColor;
        }
        
        // Update chart
        chart.update();
    }
});
