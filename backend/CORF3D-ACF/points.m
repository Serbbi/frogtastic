indir = 'data/Tripod/';
outdir = 'head_tail_coords';
outfile = [outdir filesep 'coords2.json'];
if ~exist(outdir, 'dir')
    mkdir(outdir);
end
d = dir([indir filesep '*.jpg']);
c = struct();
list = [];
for i = 1:size(d)
    startIndex = regexp(d(i).name, 'tank[1-4]_');
    if ~isempty(startIndex)
        continue
    end
    fprintf('%d/%d: ', i, size(d));
    fprintf(d(i).name);
    fprintf('\n');
    im = imread([indir filesep d(i).name]);
    [imHeight, imWidth] = size(im, [1 2]);
    f = figure;
    if imWidth > imHeight
        f.Position = [280 260 1280 720];
    else
        f.Position = [400 260 520 720];
    end
    imagesc(im);
    [x,y] = ginput(2);
    c.name = d(i).name;
    c.head = round([x(1), y(1)]);
    c.tail = round([x(2), y(2)]);
    if isempty(list)
        list = c;
    else
        list(end+1) = c;
    end
    %csvwrite([outdir filesep d(i).name(1:end-3) 'csv'], ceil([head,tail]));
    fid = fopen(outfile, 'wt');
    fprintf(fid, jsonencode(list));
    fclose(fid);
    close all;
end
