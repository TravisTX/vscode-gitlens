'use strict';
import { GitBranchReference } from './models';

export interface GitMergeStatus {
	type: 'merge';
	repoPath: string;
	HEAD: string | 'MERGE_HEAD';
	mergeBase: string | undefined;
	current: GitBranchReference;
	incoming: GitBranchReference | undefined;
}
