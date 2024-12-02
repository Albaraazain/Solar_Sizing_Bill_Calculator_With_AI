import { gsap } from "gsap";
import Chart from "chart.js/auto";
import { CountUp } from "countup.js";
import {Api} from "/src/api/index.js";


export class QuoteResultPage {
    constructor() {
        try {
            this.billData = Api.bill.getBillData();
            if (!this.billData) {
                throw new Error('No bill data available');
            }
        } catch (error) {
            console.error("Error in QuoteResultPage constructor:", error);
            this.error = "Failed to load bill data. Please try again.";
        }
        this.charts = {};
        this.progressBars = {};
        this.countUps = {};
    }

    render() {
        const app = document.getElementById("app");
        app.innerHTML = `
            <div class="h-screen w-full overflow-hidden bg-gray-50">
                <div class="h-full w-full flex flex-col p-2 sm:p-4 lg:p-8">
                    <!-- Header -->
                    <div class="flex-none mb-3 sm:mb-4 lg:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                        <div>
                            <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Solar System Quote</h1>
                            <p class="text-xs sm:text-sm lg:text-base text-gray-500">Based on your consumption analysis</p>
                        </div>
                        <button 
                            onclick="window.router.push('/bill-review')"
                            class="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors text-xs sm:text-sm lg:text-base"
                        >
                            <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    </div>

                    <!-- Main Content Area -->
                    <div class="flex-1 min-h-0 relative">
                        <div class="absolute inset-0 overflow-auto">
                            <div class="h-full max-w-[1136px] mx-auto pb-4 sm:pb-6">
                                <div class="grid grid-cols-1 xl:grid-cols-[1fr,324px] gap-3 sm:gap-4 lg:gap-6">
                                    <!-- Left Column -->
                                    ${this.renderLeftColumn()}

                                    <!-- Right Column -->
                                    ${this.renderRightColumn()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachStyles();
        this.initializeComponents();
    }

    renderLeftColumn() {
        return `
            <div class="space-y-3 sm:space-y-4 lg:space-y-6">
                <!-- Top Row -->
                <div class="grid grid-cols-1 lg:grid-cols-[325px,1fr] gap-3 sm:gap-4 lg:gap-6">
                    <!-- System Size & Stats Cards -->
                    <div class="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
                        ${this.renderSystemSizeCard()}
                        ${this.renderQuickStats()}
                    </div>
                    
                    <!-- Production Chart -->
                    ${this.renderProductionChart()}
                </div>

                <!-- Bottom Row -->
                <div class="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-3 sm:gap-4 lg:gap-6">
                    ${this.renderSavingsChart()}
                    ${this.renderEnvironmentalImpact()}
                </div>
            </div>
        `;
    }

    renderRightColumn() {
        return `
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
                ${this.renderMonthlyProduction()}
                ${this.renderCostAnalysis()}
            </div>
        `;
    }

    // Individual section renders
    renderSystemSizeCard() {
        return `
            <div class="bg-white rounded-lg p-4 shadow-sm">
                <h3 class="text-lg font-semibold mb-3 text-gray-800">System Size</h3>
                <div class="flex items-center justify-between">
                    <div class="w-16 h-16" id="system-size-progress"></div>
                    <div class="text-right">
                        <p class="text-2xl font-bold text-gray-900">
                            <span id="system-size-value">0</span>
                        </p>
                        <p class="text-sm text-gray-500">kW</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderQuickStats() {
        return `
            <div class="bg-white rounded-lg p-4 shadow-sm">
                <div class="grid grid-cols-2 gap-3 sm:gap-4">
                    <div class="text-center">
                        <div class="text-xl sm:text-3xl font-bold text-emerald-600" id="daily-production">0</div>
                        <div class="text-xs sm:text-sm text-gray-600">Daily kWh</div>
                    </div>
                    <div class="text-center">
                        <div class="text-xl sm:text-3xl font-bold text-blue-600" id="monthly-savings">0</div>
                        <div class="text-xs sm:text-sm text-gray-600">Monthly PKR</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderProductionChart() {
        return `
            <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6">
                <h3 class="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Energy Production</h3>
                <div class="h-[200px] sm:h-[250px] lg:h-[300px]">
                    <canvas id="production-chart"></canvas>
                </div>
            </div>
        `;
    }

    renderSavingsChart() {
        return `
            <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6">
                <h3 class="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Savings Timeline</h3>
                <div class="h-[200px] sm:h-[250px] lg:h-[300px]">
                    <canvas id="savings-chart"></canvas>
                </div>
            </div>
        `;
    }

    renderEnvironmentalImpact() {
        return `
            <div class="bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 text-white">
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Environmental Impact</h3>
                <div class="flex-1 flex flex-col justify-center">
                    <div class="mb-4 sm:mb-6">
                        <div class="text-xs sm:text-sm opacity-80 mb-1">CO₂ Offset</div>
                        <div class="text-xl sm:text-3xl font-bold" id="co2-value">0</div>
                        <div class="w-full bg-white/20 h-1.5 sm:h-2 rounded-full mt-2">
                            <div class="bg-white h-full rounded-full" style="width: 75%"></div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <div class="text-xs sm:text-sm opacity-80">Trees Equivalent</div>
                            <div class="text-lg sm:text-2xl font-bold" id="trees-value">0</div>
                        </div>
                        <div>
                            <div class="text-xs sm:text-sm opacity-80">Energy for Homes</div>
                            <div class="text-lg sm:text-2xl font-bold" id="homes-value">0</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderMonthlyProduction() {
        return `
            <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6">
                <h3 class="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Monthly Production</h3>
                <div class="h-[200px] sm:h-[250px]">
                    <canvas id="monthly-production-chart"></canvas>
                </div>
            </div>
        `;
    }

    renderCostAnalysis() {
        return `
            <div class="bg-gradient-to-br from-blue-700 to-blue-500 rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 text-white">
                <h3 class="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Cost Analysis</h3>
                <div class="flex-1 flex flex-col justify-center">
                    <div class="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2" id="total-cost">0</div>
                    <div class="text-xs sm:text-sm opacity-80">Total Investment</div>
                    <div class="mt-3 sm:mt-4 text-xs sm:text-sm bg-white/20 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 inline-flex items-center">
                        <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        30% Tax Credit Available
                    </div>
                </div>
            </div>
        `;
    }

    initializeComponents() {
        requestAnimationFrame(() => {
            try {
                this.initCharts();
                this.initProgressBars();
                this.initCounters();
                this.startAnimations();
            } catch (error) {
                console.error("Error initializing components:", error);
            }
        });
    }

    initCharts() {
        this.initProductionChart();
        this.initSavingsChart();
        this.initMonthlyProductionChart();
    }

    initProductionChart() {
        const ctx = document.getElementById("production-chart");
        if (!ctx) return;

        const monthlyData = this.generateMonthlyData();
        // Chart initialization code here...
    }

    initSavingsChart() {
        const ctx = document.getElementById("savings-chart");
        if (!ctx) return;

        const years = Array.from({ length: 26 }, (_, i) => `Year ${i}`);
        const systemCost = this.billData.estimatedSystemCost;
        const annualSavings = this.billData.estimatedAnnualSavings;

        const cumulativeSavings = years.map((_, i) => i * annualSavings);
        const investmentLine = years.map(() => systemCost);

        // Chart initialization code here...
    }

    initMonthlyProductionChart() {
        const ctx = document.getElementById("monthly-production-chart");
        if (!ctx) return;

        const data = this.generateMonthlyData();
        // Chart initialization code here...
    }

    startAnimations() {
        const cards = document.querySelectorAll('.bg-white, .bg-gradient-to-br');

        gsap.fromTo(
            cards,
            {
                opacity: 0,
                y: 20,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out",
                onComplete: () => {
                    this.startCounters();
                }
            }
        );
    }

    attachStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Custom Scrollbar Styles */
            .overflow-auto {
                scrollbar-width: thin;
                scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
            }
            
            .overflow-auto::-webkit-scrollbar {
                width: 6px;
            }
            
            .overflow-auto::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .overflow-auto::-webkit-scrollbar-thumb {
                background-color: rgba(156, 163, 175, 0.3);
                border-radius: 3px;
            }
            
            .overflow-auto::-webkit-scrollbar-thumb:hover {
                background-color: rgba(156, 163, 175, 0.5);
            }
        `;
        document.head.appendChild(style);
    }

    cleanup() {
        // Cleanup charts
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });

        // Cleanup progress bars
        Object.values(this.progressBars).forEach(bar => {
            if (bar) bar.destroy();
        });

        // Reset counters
        Object.values(this.countUps).forEach(counter => {
            if (counter) counter.reset();
        });

        // Kill GSAP animations
        gsap.killTweensOf("*");
    }
}
