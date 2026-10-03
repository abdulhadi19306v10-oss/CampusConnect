import os
import glob

html_files = glob.glob('client/**/*.html', recursive=True)

search_bar_html = """
            <div class="mb-3 d-flex justify-content-end table-search-container">
              <div class="input-group" style="width: 250px;">
                <span class="input-group-text bg-light border-end-0"><i class="fa-solid fa-search text-muted"></i></span>
                <input type="text" class="form-control border-start-0 bg-light page-search" placeholder="Search...">
              </div>
            </div>
            <div class="table-responsive">"""

search_js = """
  <script>
    $(document).ready(function() {
      // Global Table Live Search
      $('.page-search').on('keyup', function() {
        const value = $(this).val().toLowerCase();
        // find the closest table-responsive container which is a sibling of the search container
        $(this).closest('.table-search-container').next('.table-responsive').find('tbody tr').filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });
    });
  </script>
</body>"""

for f in html_files:
    if os.path.basename(f) in ['index.html', 'login.html']:
        continue
    
    with open(f, 'r') as file:
        content = file.read()
    
    # We only inject if there's a table and we haven't already injected
    if '<div class="table-responsive">' in content and 'table-search-container' not in content:
        # Don't inject in courses.html since I already manually added a custom one there previously
        if 'courseSearch' in content:
            continue
            
        content = content.replace('<div class="table-responsive">', search_bar_html)
        content = content.replace('</body>', search_js)
        
        with open(f, 'w') as file:
            file.write(content)

print("Search bars injected successfully across all tables")
