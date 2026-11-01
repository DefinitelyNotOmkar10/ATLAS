import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=140, bottom=140, left=200, right=200):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_callout_box(doc, title, text, bg_color="F0F7FF", border_color="2563EB"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=180, bottom=180, left=250, right=250)
    
    # Left border
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="none"/><w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/><w:bottom w:val="none"/><w:right w:val="none"/></w:tcBorders>')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    run_title = p.add_run(f"★  {title}\n")
    run_title.bold = True
    run_title.font.name = "Arial"
    run_title.font.size = Pt(10.5)
    run_title.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)
    
    run_text = p.add_run(text)
    run_text.font.name = "Arial"
    run_text.font.size = Pt(9.5)
    run_text.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def add_diagram_box(doc, diagram_title, diagram_text):
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(8)
    p_title.paragraph_format.space_after = Pt(4)
    run_t = p_title.add_run(f"▼ DIAGRAM: {diagram_title}")
    run_t.bold = True
    run_t.font.name = "Arial"
    run_t.font.size = Pt(10)
    run_t.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    set_cell_background(cell, "0F172A")
    set_cell_margins(cell, top=160, bottom=160, left=200, right=200)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(diagram_text)
    run.font.name = "Consolas"
    run.font.size = Pt(8.5)
    run.font.color.rgb = RGBColor(0x38, 0xBD, 0xF8) # light blue/cyan monospace
    
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

def main():
    doc = docx.Document()
    
    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        
        # Header / Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("ATLAS — System Flow & Architecture Specification")
        hrun.font.name = "Arial"
        hrun.font.size = Pt(8)
        hrun.font.color.rgb = RGBColor(0x94, 0xA3, 0xB8)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Confidential & Proprietary • ATLAS Trip Intelligence • Page ")
        frun.font.name = "Arial"
        frun.font.size = Pt(8)
        frun.font.color.rgb = RGBColor(0x94, 0xA3, 0xB8)

    # ── DOCUMENT TITLE ──
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(12)
    title_p.paragraph_format.space_after = Pt(2)
    t_run = title_p.add_run("ATLAS TRIP INTELLIGENCE")
    t_run.bold = True
    t_run.font.name = "Arial Black"
    t_run.font.size = Pt(24)
    t_run.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
    
    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_after = Pt(14)
    s_run = sub_p.add_run("End-to-End System Architecture, User Journeys, and AI Flow Diagrams")
    s_run.font.name = "Arial"
    s_run.font.size = Pt(13)
    s_run.font.color.rgb = RGBColor(0x25, 0x63, 0xEB)
    
    # Meta table
    meta_table = doc.add_table(rows=2, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        [("Product Name:", " ATLAS AI Trip Engine"), ("Target Platform:", " Next.js 16 + React 19 + Supabase")],
        [("Document Version:", " 2.4.0 (Production)"), ("Date Generated:", " August 2026")]
    ]
    for row_idx, row in enumerate(meta_data):
        for col_idx, (k, v) in enumerate(row):
            cell = meta_table.cell(row_idx, col_idx)
            set_cell_background(cell, "F8FAFC")
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            rk = p.add_run(k)
            rk.bold = True
            rk.font.name = "Arial"
            rk.font.size = Pt(9)
            rk.font.color.rgb = RGBColor(0x47, 0x55, 0x69)
            rv = p.add_run(v)
            rv.font.name = "Arial"
            rv.font.size = Pt(9)
            rv.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ── SECTION 1: EXECUTIVE SUMMARY ──
    h1 = doc.add_heading("1. Executive Summary & Architectural Overview", level=1)
    h1.paragraph_format.space_before = Pt(16)
    h1.paragraph_format.space_after = Pt(6)
    for r in h1.runs:
        r.font.name = "Arial"
        r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        
    doc.add_paragraph(
        "ATLAS is an enterprise-grade, AI-grounded itinerary and travel planning platform. "
        "It synthesizes complex multi-day expeditions by fusing multi-modal traveler inputs "
        "(group size, travel style, destination routes, transit preferences, budget allocations, and pace) "
        "with real-time web-grounded AI intelligence (Google Gemini 2.0 Flash / Perplexity AI). "
        "The architecture is designed for low latency, smooth GPU-accelerated micro-interactions, "
        "real-time streaming JSON chunk synthesis, resilient client-side caching, and high-fidelity PDF exports."
    )
    
    add_callout_box(
        doc,
        "Core Value Proposition",
        "• Zero-latency interactive intake via 7-step progressive onboarding.\n"
        "• Real-time streaming itinerary generation with progressive DOM hydration.\n"
        "• 100% vector brand identity & cinematic 85x World Globe zoom-in hero.\n"
        "• Full sRGB/RGB native PDF dossier compilation and Supabase Cloud synchronization."
    )

    # ── SECTION 2: END-TO-END MASTER SYSTEM FLOWCHART ──
    h2 = doc.add_heading("2. End-to-End Master System Flowchart", level=1)
    h2.paragraph_format.space_before = Pt(16)
    h2.paragraph_format.space_after = Pt(6)
    for r in h2.runs:
        r.font.name = "Arial"
        r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    doc.add_paragraph(
        "The diagram below illustrates the complete lifecycle of a user session—from landing on the homepage, "
        "progressing through the onboarding wizard, invoking the serverless AI streaming pipeline, "
        "rendering the real-time dossier, to PDF exporting and cloud persistence."
    )

    flowchart_master = """
+-----------------------------------------------------------------------------------------+
|                                    USER ACCESS LAYER                                    |
|  [ User Navigates to ATLAS (/) ] ---> [ World Globe Vector Zoom Hero (GSAP / 85x) ]     |
+--------------------------------------------+--------------------------------------------+
                                             |
                                             v
+-----------------------------------------------------------------------------------------+
|                               ONBOARDING WIZARD PIPELINE                                |
|  Step 1: Traveler Identity (Name & Aspirations)                                         |
|  Step 2: Party Headcount & Travel Style (Solo, Couple, Family, Friends, Business)        |
|  Step 3: Multi-Modal Route (Origin, Destination, En-Route Transit Options)              |
|  Step 4: Date Range & Seasonality Scheduling                                            |
|  Step 5: Travel Vibe, Pace (Relaxed / Balanced / Full Throttle) & Accommodation Tier     |
|  Step 6: Target Budget & Currency Allocation (INR, USD, EUR, GBP)                       |
|  Step 7: Expedition Verification Summary & Launch Trigger                               |
+--------------------------------------------+--------------------------------------------+
                                             |
                                             v  [ Payload Stored in localStorage & Session ]
+-----------------------------------------------------------------------------------------+
|                                SERVERLESS AI ENGINE (/api)                              |
|  [ /api/generate-itinerary POST ] <-----------------------------------------------------+
|        |
|        +---> [ Multi-Stage Prompt Synthesizer (Structured JSON Schema) ]
|        |
|        +---> [ LLM Model Router: Gemini 2.0 Flash / Perplexity Online Search ]
|        |
|        +---> [ Real-Time Web Grounding (Live Hotel Rates, Transit Schedules, Landmarks) ]
|        |
|        +---> [ Chunked Streaming Output (ReadableStream / TextEncoder) ]
+--------------------------------------------+--------------------------------------------+
                                             |
                                             v  [ Server-Sent Stream / Chunk Hydration ]
+-----------------------------------------------------------------------------------------+
|                                PLANNER DOSSIER INTERFACE                                |
|  [ Real-Time Chunk Buffer Parser ] ---> [ Progressive Day-by-Day Card Animation ]       |
|        |
|        +---> [ Destination Cover Header (Curated Real-World 4K Photography) ]
|        +---> [ En-Route Landmark Journey Stops Grid ]
|        +---> [ Morning / Afternoon / Evening Activity Timelines ]
|        +---> [ Curated Dining & Culinary Recommendations ]
|        +---> [ Curated Hotels with Live Rates & Amenity Badges ]
|        +---> [ Ground Transit & Airport Transfer Logistics ]
+--------------------------------------------+--------------------------------------------+
                     |                                              |
                     v                                              v
+------------------------------------------+   +------------------------------------------+
|          CLIENT-SIDE VAULT & PDF         |   |           SUPABASE CLOUD SYNC            |
|  [ html-to-image Native SVG Engine ]     |   |  [ Supabase Auth (Sign-in / Sign-up) ]   |
|        |                                 |   |        |                                 |
|  [ 2x High-DPI Canvas Capture ]          |   |  [ saved_trips Table RLS Insert ]        |
|        |                                 |   |        |                                 |
|  [ jsPDF Multi-Page A4 Slicing ]         |   |  [ /saved-trips Personal Vault UI ]      |
|        |                                 |   |        |                                 |
|  [ Download: Atlas-[Destination].pdf ]   |   |  [ One-Click Re-Hydration & View ]       |
+------------------------------------------+   +------------------------------------------+
"""
    add_diagram_box(doc, "ATLAS Master System Lifecycle & Data Flow", flowchart_master)

    # ── SECTION 3: STEP-BY-STEP ONBOARDING STATE MACHINE ──
    h3 = doc.add_heading("3. Onboarding State Machine & Validation Engine", level=1)
    h3.paragraph_format.space_before = Pt(16)
    h3.paragraph_format.space_after = Pt(6)
    for r in h3.runs:
        r.font.name = "Arial"
        r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    doc.add_paragraph(
        "The onboarding wizard is governed by an explicit finite state machine (FSM) implemented via "
        "React Context (`OnboardingProvider`) and custom hook `useOnboarding`. "
        "Each step features strict field validations, dynamic direction transitions (forward/backward animations), "
        "and contextual editorial photography."
    )

    onboarding_diagram = """
    [ START ]
        |
        v
 [ STEP 1: NAME ] --------( Valid Name? )---------> [ STEP 2: TRAVELERS ]
        ^                        |                         |
        | [Back]                 v [No: Display Error]     v ( Adult >= 1 & Style Selected? )
        +------------------------+                         |
                                                           +-----> [ STEP 3: DESTINATIONS ]
                                                                          |
                                                                          v ( Origin != Dest? )
                                                                          |
                                                                          +-----> [ STEP 4: DATES ]
                                                                                        |
                                                                                        v ( Start <= End? )
                                                                                        |
                                                                                        +-----> [ STEP 5: PREFERENCES ]
                                                                                                      |
                                                                                                      v ( Interest & Pace? )
                                                                                                      |
                                                                                                      +-----> [ STEP 6: BUDGET ]
                                                                                                                    |
                                                                                                                    v ( Budget > 0? )
                                                                                                                    |
                                                                                                                    +-----> [ STEP 7: SUMMARY ]
                                                                                                                                  |
                                                                                                                                  v [ Trigger AI Generation ]
                                                                                                                             [ REDIRECT TO /planner ]
"""
    add_diagram_box(doc, "Onboarding State Machine & Validation Gateways", onboarding_diagram)

    # Table of steps
    step_table = doc.add_table(rows=8, cols=4)
    step_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Step #", "State Name", "Payload Collected", "Editorial Visual Anchor"]
    for i, h in enumerate(headers):
        cell = step_table.cell(0, i)
        set_cell_background(cell, "1E293B")
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(h)
        r.bold = True
        r.font.name = "Arial"
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    step_data = [
        ("01", "NAME", "Traveler Name / Trip Nickname", "Dolomites Alps Sunrise, Italy"),
        ("02", "TRAVELERS", "Adults, Children, Travel Style (Solo/Couple/Family/Friends/Business)", "Amalfi Coastline, Italy"),
        ("03", "DESTINATIONS", "From City/Country, To City/Country, Transit Modes (Flight/Train/Car)", "Kyoto Historic Pagodas, Japan"),
        ("04", "DATES", "Start Date, End Date, Calculated Duration (Days)", "Santorini Sunset Caldera, Greece"),
        ("05", "PREFERENCES", "Interests Multi-select, Daily Pace, Accommodation Tier", "Marrakech Heritage Riad, Morocco"),
        ("06", "BUDGET", "Total Budget Amount, Currency Selector (INR/USD/EUR/GBP)", "Swiss Alps Luxury Retreat"),
        ("07", "SUMMARY", "Verification of Complete Expedition Dossier Parameters", "Bora Bora Turquoise Lagoon"),
    ]

    for row_idx, data in enumerate(step_data, start=1):
        for col_idx, text in enumerate(data):
            cell = step_table.cell(row_idx, col_idx)
            set_cell_background(cell, "F8FAFC" if row_idx % 2 == 0 else "FFFFFF")
            set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.name = "Arial"
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ── SECTION 4: AI STREAMING INGESTION & PARSING ENGINE ──
    h4 = doc.add_heading("4. Serverless AI Streaming & JSON Chunk Ingestion Flow", level=1)
    h4.paragraph_format.space_before = Pt(16)
    h4.paragraph_format.space_after = Pt(6)
    for r in h4.runs:
        r.font.name = "Arial"
        r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    doc.add_paragraph(
        "To deliver instantaneous feedback without waiting 30+ seconds for a complete multi-day itinerary to generate, "
        "ATLAS utilizes an asynchronous serverless stream parser. The AI emits structured JSON tokens chunk-by-chunk, "
        "and the client dynamically aggregates and parses completed day objects in real-time."
    )

    ai_flow = """
  CLIENT (/planner)                                NEXT.JS SERVER (/api)                      AI ENGINE (Gemini / Perplexity)
        |                                                    |                                                |
        |--- POST /api/generate-itinerary (OnboardingData) ->|                                                |
        |                                                    |--- Construct System & Grounding Prompt ------->|
        |                                                    |    (Inject Budget, Pacing, Transit, Stops)     |
        |                                                    |                                                |
        |                                                    |                                                |--- Web Search Grounding
        |                                                    |                                                |    (Live Rates & Spots)
        |                                                    |                                                |
        |                                                    |<-- Stream Text Chunks (chunk 1, 2, 3...) ------|
        |                                                    |                                                |
        |<-- HTTP 200 chunked stream (ReadableStream) -------|                                                |
        |                                                                                                     
        +---> [ Client Stream Buffer Accumulator ]
        |           |
        |           +---> [ Regex / JSON Boundary Slicer: Extract Complete {"day": X, ...} ]
        |           |
        |           +---> [ Update State: setParsedDays([...prev, newDay]) ]
        |           |
        |           +---> [ Instant UI Card Reveal Animation (DayCard, MealCard, HotelCard) ]
        |
        v [ Stream Finished (EOF) ]
  [ Save Itinerary to Local Cache & Prompt Save to Cloud Vault ]
"""
    add_diagram_box(doc, "Serverless AI Streaming & Incremental Hydration Protocol", ai_flow)

    # ── SECTION 5: MODERN PDF RENDERING ARCHITECTURE ──
    h5 = doc.add_heading("5. High-DPI PDF Rendering & Multi-Page Export Engine", level=1)
    h5.paragraph_format.space_before = Pt(16)
    h5.paragraph_format.space_after = Pt(6)
    for r in h5.runs:
        r.font.name = "Arial"
        r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    doc.add_paragraph(
        "PDF generation is powered by a high-definition rendering pipeline utilizing `html-to-image` "
        "and `jspdf`. By bypassing legacy JavaScript CSS parsers, ATLAS achieves 100% compatibility "
        "with modern Tailwind CSS v4, custom `@theme` variables, and high-DPI retina displays."
    )

    pdf_flow = """
  [ User Clicks 'Export PDF' ]
        |
        v
  [ Lock UI: setIsPdfGenerating(true) ]
        |
        v
  [ Filter DOM: Exclude '.no-print' Elements (Export Buttons, Alerts) ]
        |
        v
  [ html-to-image::toCanvas(itineraryRef.current, { pixelRatio: 2, quality: 0.95 }) ]
        |
        +---> Converts DOM tree to native SVG <foreignObject>
        +---> Renders SVG directly via Chrome/Browser Native 2D Canvas
        +---> Outputs 2x High-DPI Bitmapped Canvas with sRGB Colors
        |
        v
  [ jsPDF Multi-Page Pagination Loop ]
        |
        +---> Page Format: A4 (210mm x 297mm)
        +---> Calculate imgHeight = (canvas.height * 210) / canvas.width
        +---> While (heightLeft > 0):
        |       - Draw slice onto current A4 page
        |       - Advance position by -297mm
        |       - pdf.addPage() if additional days remain
        |
        v
  [ Save PDF: Atlas-[Destination-City].pdf ]
        |
        v
  [ Release UI: setIsPdfGenerating(false) ]
"""
    add_diagram_box(doc, "High-DPI Native PDF Compilation & Pagination Flow", pdf_flow)

    # ── SECTION 6: DATA PERSISTENCE & SECURITY ──
    h6 = doc.add_heading("6. Data Persistence, Authentication & Cloud Vault Flow", level=1)
    h6.paragraph_format.space_before = Pt(16)
    h6.paragraph_format.space_after = Pt(6)
    for r in h6.runs:
        r.font.name = "Arial"
        r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    doc.add_paragraph(
        "ATLAS employs a resilient hybrid data architecture combining zero-latency local caching "
        "with Supabase Cloud persistence secured by Postgres Row Level Security (RLS)."
    )

    data_flow = """
+-----------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER                                       |
|                                                                                         |
|  [ LocalStorage: 'planify_onboarding' ] <=======> [ LocalStorage: 'planify_itinerary' ]  |
|                           |                                         |                   |
+---------------------------+-----------------------------------------+-------------------+
                            |                                         |
                            v                                         v
+-----------------------------------------------------------------------------------------+
|                                 SUPABASE CLOUD BACKEND                                  |
|                                                                                         |
|  +-----------------------------+         +-------------------------------------------+  |
|  |     auth.users Table        |         |             saved_trips Table             |  |
|  |-----------------------------|         |-------------------------------------------|  |
|  | id (UUID)                   | <-----> | id (UUID Primary Key)                     |  |
|  | email (VARCHAR)             |         | user_id (UUID Foreign Key -> auth.users)  |  |
|  | encrypted_password          |         | departure (VARCHAR)                       |  |
|  | created_at (TIMESTAMP)      |         | destination (VARCHAR)                     |  |
|  +-----------------------------+         | start_date (DATE)                         |  |
|                                          | end_date (DATE)                           |  |
|                                          | onboarding_data (JSONB)                   |  |
|                                          | itinerary_data (JSONB)                    |  |
|                                          | created_at (TIMESTAMP DEFAULT now())      |  |
|                                          +-------------------------------------------+  |
|                                                                |                        |
|                                                                v                        |
|                                          [ Postgres RLS: user_id = auth.uid() ]         |
+-----------------------------------------------------------------------------------------+
"""
    add_diagram_box(doc, "Supabase Cloud Vault Schema & Hybrid Cache Flow", data_flow)

    # ── SECTION 7: TECH STACK MATRIX ──
    h7 = doc.add_heading("7. Technical Specifications & Architecture Matrix", level=1)
    h7.paragraph_format.space_before = Pt(16)
    h7.paragraph_format.space_after = Pt(6)
    for r in h7.runs:
        r.font.name = "Arial"
        r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    tech_table = doc.add_table(rows=8, cols=3)
    tech_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    tech_headers = ["Layer", "Technology", "Architectural Role & Functionality"]
    for i, h in enumerate(tech_headers):
        cell = tech_table.cell(0, i)
        set_cell_background(cell, "1E293B")
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(h)
        r.bold = True
        r.font.name = "Arial"
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    tech_data = [
        ("Framework", "Next.js 16 (App Router) + React 19", "Server components, serverless API routes, optimized edge bundling"),
        ("Styling & Design", "Tailwind CSS v4 + Lucide Icons", "Minimalist luxury editorial aesthetic, standardized sRGB tokens"),
        ("Motion & Animation", "GSAP 3 + Framer Motion", "85x vector portal zoom, smooth step sliding, staggered testimonials"),
        ("AI Synthesis", "Google Gemini 2.0 Flash / Perplexity", "Multi-modal prompt grounding, streaming JSON chunk emission"),
        ("PDF Generation", "html-to-image + jsPDF 4", "Native browser foreignObject rendering, 2x DPI multi-page export"),
        ("Cloud Database", "Supabase (PostgreSQL + RLS)", "User identity sessions, JSONB document store for trips"),
        ("Image CDN", "Unsplash Real-World 4K Collection", "Curated high-resolution destination, hotel, and landmark photography"),
    ]

    for row_idx, (layer, tech, role) in enumerate(tech_data, start=1):
        row = tech_table.rows[row_idx]
        for col_idx, text in enumerate([layer, tech, role]):
            cell = row.cells[col_idx]
            set_cell_background(cell, "F8FAFC" if row_idx % 2 == 0 else "FFFFFF")
            set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.name = "Arial"
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
            if col_idx == 0:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(14)
    
    # Conclusion
    end_p = doc.add_paragraph()
    end_p.paragraph_format.space_before = Pt(12)
    end_run = end_p.add_run("■ End of ATLAS Architecture & Flow Specification Document.")
    end_run.bold = True
    end_run.font.name = "Arial"
    end_run.font.size = Pt(9)
    end_run.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

    # Save file
    output_path = "d:/Planify/Planify/ATLAS_System_Architecture_and_Flow_Diagram.docx"
    doc.save(output_path)
    print(f"Successfully generated: {output_path}")

if __name__ == "__main__":
    main()
