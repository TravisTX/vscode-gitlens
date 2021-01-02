'use strict';
import { Command, MarkdownString, ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { Commands, DiffWithCommandArgs } from '../../commands';
import { BuiltInCommands, GlyphChars } from '../../constants';
import { GitFile, GitMergeStatus, GitRebaseStatus, GitReference } from '../../git/git';
import { GitUri } from '../../git/gitUri';
import { View } from '../viewBase';
import { ContextValues, ViewNode } from './viewNode';

export class MergeConflictCurrentChangesNode extends ViewNode {
	constructor(
		view: View,
		parent: ViewNode,
		private readonly status: GitMergeStatus | GitRebaseStatus,
		private readonly file: GitFile,
	) {
		super(GitUri.fromFile(file, status.repoPath, 'HEAD'), view, parent);
	}

	getChildren(): ViewNode[] {
		return [];
	}

	getTreeItem(): TreeItem {
		const item = new TreeItem('Current changes', TreeItemCollapsibleState.None);
		item.contextValue = ContextValues.MergeConflictCurrentChanges;
		item.description = GitReference.toString(this.status.current, { expand: false, icon: false });
		item.iconPath = new ThemeIcon('diff');
		item.tooltip = new MarkdownString(
			`Current changes to $(file)${GlyphChars.Space}${this.file.fileName} on ${GitReference.toString(
				this.status.current,
			)}`,
			true,
		);
		item.command = this.getCommand();

		return item;
	}

	getCommand(): Command | undefined {
		if (this.status.mergeBase == null) {
			return {
				title: 'Open Revision',
				command: BuiltInCommands.Open,
				arguments: [GitUri.toRevisionUri('HEAD', this.file.fileName, this.status.repoPath)],
			};
		}

		const commandArgs: DiffWithCommandArgs = {
			lhs: {
				sha: this.status.mergeBase,
				uri: GitUri.fromFile(this.file, this.status.repoPath, undefined, true),
				title: `${this.file.fileName} (merge-base)`,
			},
			rhs: {
				sha: 'HEAD',
				uri: GitUri.fromFile(this.file, this.status.repoPath),
				title: `${this.file.fileName} (${GitReference.toString(this.status.current, {
					expand: false,
					icon: false,
				})})`,
			},
			repoPath: this.status.repoPath,
			line: 0,
			showOptions: {
				preserveFocus: true,
				preview: true,
			},
		};
		return {
			title: 'Open Changes',
			command: Commands.DiffWith,
			arguments: [commandArgs],
		};
	}
}
