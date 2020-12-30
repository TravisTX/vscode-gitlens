'use strict';
import { GitStatusFile } from './status';

export interface MergeStatus {
	repoPath: string;
	into: string;
	mergeBase: string | undefined;
	incoming: string | undefined;
	conflicts: GitStatusFile[];
}
