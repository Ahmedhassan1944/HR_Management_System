# Prompt: Fixing Row 5 Layout and Implementing Dual-Axis Scrollbars

## 🔍 Root Cause Analysis Fix
The charts are currently stacking because they are wrapped in separate `<div class="row">` containers. We need to merge them into one row and enforce a 50/50 split with controlled overflow.

## 🛠️ Required Changes

### 1. Structural Fix (Index.html)
- Locate the section for **Row 5**.
- **Action:** Ensure there is only **ONE** `<div class="row">` for both charts.
- **Structure:**
  ```html
  <div class="row" id="row-5-container">
    <!-- Left Column: Job Title Bar Chart -->
    <div class="col-md-6">
       <div id="job-title-wrapper" class="chart-scroll-vertical">
          <div id="job_title_chart_div"></div>
       </div>
    </div>
    
    <!-- Right Column: Department Column Chart -->
    <div class="col-md-6">
       <div id="dept-wrapper" class="chart-scroll-horizontal">
          <div id="dept_chart_div"></div>
       </div>
    </div>
  </div>