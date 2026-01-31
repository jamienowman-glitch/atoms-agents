import os

def crawl_routes(root_dir):
    routes = []
    print(f"Crawling {root_dir}...")
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename in ['page.tsx', 'page.js', 'page.jsx']:
                full_path = os.path.join(dirpath, filename)
                # Make relative to root for readability
                rel_path = os.path.relpath(full_path, start='/Users/jaynowman/dev/atoms-app')
                routes.append(rel_path)
    
    routes.sort()
    return routes

if __name__ == "__main__":
    target = "/Users/jaynowman/dev/atoms-app/src/app"
    all_routes = crawl_routes(target)
    
    print(f"\nFOUND {len(all_routes)} ROUTES:")
    print("="*40)
    for r in all_routes:
        print(r)
    print("="*40)
