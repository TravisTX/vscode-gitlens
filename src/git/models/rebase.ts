'use strict';
import { GitBranchReference, GitRevisionReference } from './models';

export interface GitRebaseStatus {
	type: 'rebase';
	repoPath: string;
	HEAD: string | 'REBASE_HEAD';
	mergeBase: string | undefined;
	current: GitBranchReference | undefined;
	incoming: GitBranchReference;

	step: number;
	stepCurrent: GitRevisionReference;
	steps: number;
}
